import { sendFailure, sendSuccess } from "../../utils.js";

export const decrementAttendees = (db, event_id) => {
  db.prepare(`UPDATE events SET attendees = attendees - 1 where event_id = ?`)
    .run(event_id);
};

export const updateEnrollment = (db, lookUpValues) => {
  return db.prepare(
    `UPDATE enrollments SET status = 'cancelled' where event_id = ? and user_id = ?`,
  ).run(...lookUpValues);
};

export const cancelEnrollment = (db, body) => {
  try {
    const values = Object.values(body);
    updateEnrollment(db, values);
    decrementAttendees(db, body.event_id);
    return sendSuccess("Cancelled successfully", 200);
  } catch (e) {
    return sendFailure(e.message, 401);
  }
};
