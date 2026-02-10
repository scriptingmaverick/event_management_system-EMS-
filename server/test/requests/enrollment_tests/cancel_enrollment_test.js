import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { DatabaseSync } from "node:sqlite";
import {
  cancelEnrollment,
  updateEnrollment,
} from "../../../src/requests/enrollment/cancel_enrollment.js";

describe("Cancel enrollment", () => {
  const db = new DatabaseSync(":memory:");
  const data = {
    event_id: 1,
    user_id: 1,
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
  db.prepare(`INSERT into enrollments (event_id, user_id) values(?,?)`)
    .run(1, 1);

  describe("update status in enrollments", () => {
    it("1. cancel with valid data", () => {
      const values = Object.values(data);
      updateEnrollment(db, values);
      const dataInDb = db.prepare(`SELECT * FROM enrollments`).all();
      assertEquals(dataInDb[0].status, "cancelled");
    });
  });

  describe("cancel enrollment", () => {
    it("1. with valid data", async () => {
      const response = cancelEnrollment(db, data);
      assertEquals(response.status, 200);
      assertEquals(await response.text(), "Cancelled successfully");
    });
    it("2. with invalid data", () => {
      const response = cancelEnrollment();
      assertEquals(response.status, 401);
    });
  });
});
