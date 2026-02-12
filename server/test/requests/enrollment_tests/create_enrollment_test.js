import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { DatabaseSync } from "node:sqlite";
import {
  createEnrollment,
  insertNewEnrollment,
} from "../../../src/requests/enrollment/create_enrollment.js";

describe("Create enrollment", () => {
  const db = new DatabaseSync(":memory:");
  const data = {
    "event_id": 1,
    "user_id": 1,
  };
  db.exec(`CREATE TABLE IF NOT EXISTS enrollments(
    event_id INTEGER,
    user_id INTEGER,
    status TEXT DEFAULT('confirmed'),
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

  describe("insert to new enrollment", () => {
    it("with valid data", () => {
      const values = Object.values(data);
      const { lastInsertRowid } = insertNewEnrollment(db, values);
      const dataInDb = db.prepare(`SELECT * from enrollments`).all();
      assertEquals(lastInsertRowid, 1);
      assertEquals(dataInDb[0].status, "confirmed");
      assertEquals(dataInDb[0].event_id, 1);
      assertEquals(dataInDb[0].user_id, 1);
    });
  });

  describe("create enrollment", () => {
    it("create enrollment with valid data", async () => {
      db.prepare("delete from enrollments where user_id = 1;").run();
      const response = createEnrollment(db, data);
      assertEquals((await response.json()).data, "Enrolled successfully");
      assertEquals(response.status, 201);
    });

    it("create enrollment with same user_id and event_id", async () => {
      const response = createEnrollment(db, data);
      assertEquals(
        (await response.json()).data,
        "UNIQUE constraint failed: enrollments.event_id, enrollments.user_id",
      );
      assertEquals(response.status, 401);
    });

    it("with invalid data", async () => {
      const response = createEnrollment();
      assertEquals(response.status, 401);
      assertEquals(
        (await response.json()).data,
        "Cannot convert undefined or null to object",
      );
    });
  });
});
