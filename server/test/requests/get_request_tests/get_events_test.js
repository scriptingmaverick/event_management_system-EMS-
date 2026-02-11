import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { getEventsByUser } from "../../../src/requests/get_requests/get_events.js";
import { DatabaseSync } from "node:sqlite";

describe("Get events by user", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(`CREATE TABLE events(
    user_id integer,
    event_id integer,
    event_title text
    );`);
  const data = { userId: 1 };
  db.prepare(
    `INSERT INTO events (user_id, event_id, event_title) values(?,?,?)`,
  )
    .run(1, 1, "music");

  describe("get event by user", () => {
    it("1. should all the event top related to the specific user", () => {
      const response = getEventsByUser(db, data.userId);
      assertEquals(response.success, true);
      assertEquals(response.body, {
        user_id: 1,
        event_id: 1,
        event_title: "music",
      });
    });
    it("2. When db is undefined", () => {
      const response = getEventsByUser("_", data.userId);
      assertEquals(response.success, false);
    });
    it("3. when data is undefined",() => {
      const response = getEventsByUser(db);
      assertEquals(response.success, false  )
    })
  });
});
