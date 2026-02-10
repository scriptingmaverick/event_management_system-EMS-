import { describe, it } from "@std/testing";
import { assertEquals } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { cancelEvent } from "../../../src/requests/event/cancel_event.js";

describe("testing cancelEvent functionality with in-memory DB", () => {
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
    status: "confirmed",
  };

  db.exec(
    "create table events(event_id integer primary key autoincrement, event_title text not null,type text not null,description text,location text,capacity integer,entry_fee integer,event_date text,updated_at text,status text);",
  );

  db.prepare(
    "insert into events(event_title,type,description,location,capacity,entry_fee,event_date,updated_at,status) values(?,?,?,?,?,?,?,?,?);",
  ).run(...Object.values(data));

  it("testing with changing status to cancellation", async () => {
    const response = cancelEvent(db, 1);
    assertEquals(response.status, 200);
    assertEquals(await response.text(), "Event cancelled");
  });
});
