import { assertEquals, assertThrows } from "@std/assert";
import { describe,it } from "@std/testing";
import { DatabaseSync } from "node:sqlite";
import {
  createEvent,
  insertNewEventOn,
} from "../../../src/requests/event/create_event.js";

describe("create event functionality", () => {
  
  const db = new DatabaseSync(":memory:");
  const data = {
    "event_id": 1,
    "event_title": "music concert",
    "description": "",
    "type": "music concert",
    "status": "confirmed",
    "location": "bangalore",
    "capacity": 25,
    "entry_fee": 200,
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
    entry_fee integer,
    location text not null,
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
      const body = Object.values(data);
      body.shift();
      const response = createEvent(db, body);
      assertEquals(response.status, 200);
      assertEquals(await response.text(), "Event created");
    });
  });
});
