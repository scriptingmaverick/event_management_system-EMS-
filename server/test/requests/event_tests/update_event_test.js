import { describe, it } from "@std/testing";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { updateEvent } from "../../../src/requests/event/update_event.js";

describe("testing updateEvent functionality with in-memory DB", () => {
  const db = new DatabaseSync(":memory:");
  const data = {
    event_title: "dsp concert",
    type: "concert",
    description: "dsp is coming to conduct concert",
    location: "here",
    capacity: 120,
    entry_fee: 30,
    event_date: "15-09-2026",
    updated_at: "10-02-2026",
  };

  db.exec(
    "create table events(event_id integer primary key autoincrement, event_title text not null,type text not null,description text,location text,capacity integer,entry_fee integer,event_date text,updated_at text);",
  );

  db.prepare(
    "insert into events(event_title,type,description,location,capacity,entry_fee,event_date,updated_at) values(?,?,?,?,?,?,?,?);",
  ).run(...Object.values(data));

  it("testing with changing multiple columns", async () => {
    let {
      event_date,
      event_title,
      description,
      location,
      capacity,
      entry_fee,
      updated_at,
    } = data;
    event_title = "new concert";
    const body = {
      event_date,
      event_title,
      description,
      location,
      capacity,
      entry_fee,
      updated_at,
    };
    const response = updateEvent(db, 1, body);
    assertEquals(response.status, 202);
    assertEquals(await response.text(), "Event details updated");
  });

  it("testing with changing only 1-column", async () => {
    const response = updateEvent(db, 1, { event_title: "my concert" });
    assertEquals(response.status, 202);
    assertEquals(await response.text(), "Event details updated");
  });
});
