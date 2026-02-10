import { sendFailure, sendSuccess } from "../../utils.js";

export const insertNewEventOn = (DB, data) => {
  return DB.prepare(
    "insert into events(event_title, location,capacity,user_id) values(?,?,?,?);",
  )
    .run(...data);
};

export const createEvent = (DB, { user_id }, body) => {
  const data = Object.values(body);
  data.push(user_id);
  try {
    insertNewEventOn(DB, data);
    return sendSuccess("Event created", 200);
  } catch {
    return sendFailure("Internal error", 501);
  }
};
