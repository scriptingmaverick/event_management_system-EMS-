import { createResponse } from "../../utils.js";

export const getSubscribedEvents = (db, userData) => {
  try {
    const query =
      `SELECT enrollments.user_id, events.event_id, event_title, enrollment_status, enrolled_at,event_date, description, type,location, events.status FROM enrollments inner join events on events.event_id = enrollments.event_id WHERE enrollments.user_id = ?;`;
    const result = db.prepare(query).all(userData.user_id);
    console.log(result)
    return createResponse({ data: result, success: true });
  } catch (e) {
    return createResponse({ data: e.message, success: false }, 501);
  }
};
