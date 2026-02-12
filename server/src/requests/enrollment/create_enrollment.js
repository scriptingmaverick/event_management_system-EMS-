import { createResponse } from "../../utils.js";

export const incrementAttendees = (db, event_id) => {
  db.prepare(`UPDATE events SET attendees = attendees + 1 where event_id = ?`)
    .run(event_id);
};

export const insertNewEnrollment = (db, values) => {
  const query = `INSERT INTO enrollments (event_id, user_id) values(?,?)`;
  return db.prepare(query).run(...values);
};

export const createEnrollment = (db, body) => {
  try {
    const values = Object.values(body);
    insertNewEnrollment(db, values);
    incrementAttendees(db, body.event_id);
    return createResponse(
      { success: true, data: "Enrolled successfully" },
      201,
    );
  } catch (e) {
    return createResponse({ success: false, data: e.message }, 401);
  }
};
