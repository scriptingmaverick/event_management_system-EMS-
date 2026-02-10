import { sendFailure, sendSuccess } from "../../utils.js";

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

    return sendSuccess("Event created", 200);
  } catch (e) {
    return sendFailure(e.message, 501);
  }
};
