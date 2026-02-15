import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { DatabaseSync } from "node:sqlite";
import { getSubscribedEvents } from "../../../src/requests/get_requests/get_user_enrollments.js";

describe("get user enrollments", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(`CREATE TABLE IF NOT EXISTS enrollments(
    event_id INTEGER,
    user_id INTEGER,
    enrollment_status TEXT DEFAULT('confirmed'),
    enrolled_at TEXT DEFAULT(DATETIME('now','localtime')));
    `);
  db.exec(`CREATE TABLE IF NOT EXISTS events(
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_title TEXT,
    description TEXT,
    type TEXT,
    status TEXT,
    location TEXT,
    attendees INTEGER DEFAULT(0),
    event_date DEFAULT (DATETIME('now','localtime')),
    created_at DEFAULT (DATETIME('now','localtime')),
    updated_at DEFAULT (DATETIME('now','localtime')),
    user_id INTEGER);`);
  db.prepare(`insert into enrollments(user_id, event_id) values(?,?)`)
    .run(1, 1);
  db.prepare(`insert into enrollments(user_id, event_id) values(?,?)`)
    .run(2, 1);
  db.prepare(
    `insert into events(event_title,description,type,status,location,user_id) values(?,?,?,?,?,?)`,
  ).run("music", "guest: karthik", "music concert", "confirmed", "ban", 1);
  db.prepare(
    `insert into events(event_title,description,type,status,location,user_id ) values(?,?,?,?,?,?)`,
  ).run(
    "stand up on music",
    "guest: khasim",
    "stand up",
    "confirmed",
    "ban",
    1,
  );
  const userData = { user_id: 1 };
  describe("get event enrolled by user", () => {
    it("1. get event enrolled by user ", () => {
      const response = getSubscribedEvents(db, userData);
      assertEquals(response.status, 200);
    });
    it("2. with invalid data", () => {
      const response = getSubscribedEvents(db);
      assertEquals(response.status, 501);
    });
  });
});
