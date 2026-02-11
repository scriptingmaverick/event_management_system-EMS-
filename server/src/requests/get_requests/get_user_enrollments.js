import { createResponse } from "../../utils.js";

export const getEventByUserEnrollments = (db, userData) => {
  try {
    const query =
      `SELECT events.user_id, events.event_id, event_title, enrollments.status, enrolled_at,event_date, description, type,location, events.status FROM enrollments inner join events on events.user_id = enrollments.user_id and enrollments.user_id = ?`;
      const result = db.prepare(query).all  (userData.user_id);
    return createResponse({ data: result, success: true });
  } catch (e) {
    return createResponse({ data: e.message, success: false }, 501);
  }
};
