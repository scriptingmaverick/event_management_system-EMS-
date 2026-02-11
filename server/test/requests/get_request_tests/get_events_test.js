import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { getEventsByType } from "../../../src/requests/get_requests/get_events.js";
import { DatabaseSync } from "node:sqlite";

describe("Get events of a specific type", () => {
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
    .run(2, 2, "laughing", "concert");
  db.prepare(
    `INSERT INTO events (user_id, event_id, event_title,type) values(?,?,?,?)`,
  )
    .run(1, 3, "tere ishq mein", "movie");
  db.prepare(
    `INSERT INTO events (user_id, event_id, event_title,type) values(?,?,?,?)`,
  )
    .run(1, 4, "standup", "standup");

  describe("get all events of a specific type", () => {
    it("1. List all the events of a type", async () => {
      const response = getEventsByType(db, { type: "concert" });
      const body = await response.json();
      assertEquals(body.success, true);
      assertEquals(body.data, [{
        user_id: 1,
        event_id: 1,
        event_title: "music",
        type: "concert",
      }, {
        user_id: 2,
        event_id: 2,
        type: "concert",
        event_title: "laughing",
      }]);
    });

    it("2. When db is undefined", async () => {
      const response = await getEventsByType("_").json();
      assertEquals(response.success, false);
    });
  });
});
