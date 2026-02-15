import { createResponse } from "../../utils.js";

export const decrementAttendees = (db, event_id) => {
  db.prepare(
    `UPDATE events SET attendees = attendees - 1 where event_id = ?`,
  ).run(event_id);
};

export const updateEnrollment = (db, lookUpValues) => {
  return db
    .prepare(
      `UPDATE enrollments SET enrollment_status = 'cancelled' where event_id = ? and user_id = ?`,
    )
    .run(...lookUpValues);
};

export const unsubscribe = (db, body) => {
  try {
    const values = Object.values(body);
    updateEnrollment(db, values);
    decrementAttendees(db, body.event_id);

    return createResponse({ success: true, data: "Cancelled successfully" });
  } catch (e) {
    return createResponse({ success: true, data: e.message }, 501);
  }
};
