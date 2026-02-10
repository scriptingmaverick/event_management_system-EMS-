import { assertEquals, assertThrows } from "@std/assert";
import { describe } from "@std/testing";
import {
  createEvent,
  insertNewEventOn,
} from "../../../src/requests/event/create_event.js";
import { DatabaseSync } from "node:sqlite";
import { it } from "node:test";

describe("create event functionality", () => {
  const db = new DatabaseSync(":memory:");
  const data = {
    "event_id": 1,
    "event_title": "music concert",
    "capacity": 25,
    "user_id": 1,
    "location": "bangalore",
  };
  db.exec(
    `create table events(
    event_id integer primary key autoincrement,
    event_title text  not null,
    user_id integer not null,
    location text not null,
    capacity integer not null);`,
  );
  const userDetails = { "user_id": 1 };

  describe("testing insert new event", () => {
    it("1. Test with valid values", () => {
      const { event_title, location, capacity } = data;
      const body = [event_title, location, capacity, userDetails.user_id];
      insertNewEventOn(db, body);
      const dataInDb = db.prepare("select * from events;").all();
      assertEquals(dataInDb, [data]);
    });
    it("2. without arguments", () => {
      assertThrows(() => insertNewEventOn());
    });
  });

  describe("testing create event functionality", () => {
    it("1. with valid data", async () => {
      const userDetails = { user_id: 1 };
      const { event_title, capacity, location } = data;
      const body = { event_title, capacity, location };
      const response = createEvent(db, userDetails, body);
      console.log(response);
      assertEquals(response.status, 200);
      assertEquals(await response.text(), "Event created");
    });
  });
});
