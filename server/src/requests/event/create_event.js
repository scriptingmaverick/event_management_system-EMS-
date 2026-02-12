import {createResponse } from "../../utils.js";

export const insertNewEventOn = (DB, data) => {
  return DB.prepare(
    "insert into events(event_title,description,type,status, location,capacity,entry_fee,user_id) values(?,?,?,?,?,?,?,?);",
  )
    .run(...data);
};

export const createEvent = (DB, body) => {
  const data = Object.values(body);
  try {
    insertNewEventOn(DB, data);
    return createResponse({ success: true, data: "Event created" });
  } catch (e) {
    return createResponse({ success: false, data: e.message }, 501);
  }
};
