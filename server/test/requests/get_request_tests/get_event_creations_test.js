import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { getEventsByUser } from "../../../src/requests/get_requests/get_event_creations.js";
import { DatabaseSync } from "node:sqlite";

describe("Get events created by user", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(`CREATE TABLE events(
    user_id integer,
    event_id integer,
    event_title text
    );`);
  const data = { user_id: 1 };
  db.prepare(
    `INSERT INTO events (user_id, event_id, event_title) values(?,?,?)`,
  )
    .run(1, 1, "music");

  describe("get event by user", () => {
    it("1. should all the event top related to the specific user", async () => {
      const response = getEventsByUser(db, data);
      const body = await response.json();
      assertEquals(body.success, true);
      assertEquals(body.data, [{
        user_id: 1,
        event_id: 1,
        event_title: "music",
      }]);
    });

    it("2. When db is undefined", async () => {
      const response = await getEventsByUser("_", data).json();
      assertEquals(response.success, false);
    });

    it("3. when data is undefined", async () => {
      const response = await getEventsByUser(db).json();
      assertEquals(response.success, false);
    });
  });
});
