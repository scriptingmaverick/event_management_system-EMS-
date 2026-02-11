import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { getEventTypes } from "../../../src/requests/get_requests/get_event_types.js";
import { DatabaseSync } from "node:sqlite";

describe("Get events by user", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(`CREATE TABLE events(
    user_id integer,
    event_id integer,
    event_title text,
    type text
    );`);
  db.prepare(
    `INSERT INTO events (user_id, event_id, event_title,type) values(?,?,?,?)`,
  )
    .run(1, 1, "music", "concert");
  db.prepare(
    `INSERT INTO events (user_id, event_id, event_title,type) values(?,?,?,?)`,
  )
    .run(2, 2, "music", "concert");
  db.prepare(
    `INSERT INTO events (user_id, event_id, event_title,type) values(?,?,?,?)`,
  )
    .run(1, 3, "tere ishq mein", "movie");
  db.prepare(
    `INSERT INTO events (user_id, event_id, event_title,type) values(?,?,?,?)`,
  )
    .run(1, 4, "standup", "standup");

  describe("get event types", () => {
    it("1. List all the types of events", async () => {
      const response = getEventTypes(db);
      const body = await response.json();
      assertEquals(body.success, true);
      assertEquals(body.data, [{
        type: "concert",
      }, {
        type: "movie",
      }, {
        type: "standup",
      }]);
    });

    it("2. When db is undefined", async () => {
      const response = await getEventTypes("_").json();
      assertEquals(response.success, false);
    });
  });
});
