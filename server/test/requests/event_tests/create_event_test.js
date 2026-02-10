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
    "description": "",
    "type": "music concert",
    "status": "confirmed",
    "event_date": "10-02-2026",
    "location": "bangalore",
    "capacity": 25,
    "updated_at": "10-01-2029",
    "user_id": 1,
  };
  db.exec(
    `create table events(
    event_id integer primary key autoincrement,
    user_id integer not null,
    event_title text  not null,
    description text not null,
    type text not null,
    status text not null,
    event_date text not null,
    location text not null,
    updated_at text not null,
    capacity integer not null);`,
  );

  describe("testing insert new event", () => {
    it("1. Test with valid values", () => {
      const body = Object.values(data);
      body.shift();
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
      const body = Object.values(data);
      body.shift();
      body.pop();
      const response = createEvent(db, userDetails, body);
      assertEquals(response.status, 200);
      assertEquals(await response.text(), "Event created");
    });
  });
});
