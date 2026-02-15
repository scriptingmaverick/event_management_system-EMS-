import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { DatabaseSync } from "node:sqlite";
import {
  unsubscribe,
  updateEnrollment,
} from "../../../src/requests/subscription_handler/unsubscribe.js";

describe("Cancel enrollment", () => {
  const db = new DatabaseSync(":memory:");
  const data = {
    event_id: 1,
    user_id: 1,
  };

  db.exec(`CREATE TABLE IF NOT EXISTS enrollments(
    event_id INTEGER,
    user_id INTEGER,
    enrollment_status TEXT DEFAULT('confirmed'),
    created_at TEXT DEFAULT(DATETIME('now','localtime')),

    PRIMARY KEY(event_id, user_id),
    FOREIGN KEY(event_id) REFERENCES events(event_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
    );`);

  db.exec(`CREATE TABLE IF NOT EXISTS events(
      event_id integer PRIMARY KEY,
      attendees integer default(0)
      );`);

  db.exec(`CREATE TABLE IF NOT EXISTS users(
      user_id integer PRIMARY KEY
      );`);

  db.prepare(`INSERT into events (event_id) values(?)`).run(1);
  db.prepare(`INSERT into users (user_id) values(?)`).run(1);
  db.prepare(`INSERT into enrollments (event_id, user_id) values(?,?)`).run(
    1,
    1,
  );

  describe("update enrollment_status in enrollments", () => {
    it("1. cancel with valid data", () => {
      const values = Object.values(data);
      updateEnrollment(db, values);
      const dataInDb = db.prepare(`SELECT * FROM enrollments`).all();
      assertEquals(dataInDb[0]["enrollment_status"], "cancelled");
    });
  });

  describe("cancel enrollment", () => {
    it("1. with valid data", async () => {
      const response = unsubscribe(db, data);
      assertEquals(response.status, 200);
      assertEquals((await response.json()).data, "Cancelled successfully");
    });
    it("2. with invalid data", () => {
      const response = unsubscribe();
      assertEquals(response.status, 501);
    });
  });
});
