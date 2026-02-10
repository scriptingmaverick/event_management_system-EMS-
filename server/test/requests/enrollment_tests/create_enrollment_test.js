import { assertEquals, assertThrows } from "@std/assert";
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
    enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER,
    user_id INTEGER,
    status TEXT DEFAULT('confirmed'),
    created_at TEXT DEFAULT(DATETIME('now','localtime'))
    );`);
  db.exec(`CREATE TABLE IF NOT EXISTS events(
      event_id integer,
      attendees integer default(0)
      );`);
  db.prepare(`INSERT into events (event_id) values(?)`).run(1);
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
      const response = createEnrollment(db, data);
      assertEquals(response.status, 201);
      assertEquals(await response.text(), "Enrolled successfully");
    });

    it("with invalid data", async () => {
      const response = createEnrollment();
      assertEquals(response.status, 401);
      assertEquals(
        await response.text(),
        "Cannot convert undefined or null to object",
      );
    });
  });
});
