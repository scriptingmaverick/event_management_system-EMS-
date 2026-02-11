import { createResponse } from "../../utils.js";

export const getEventsByUser = (db, userData) => {
  try {
    const query = `SELECT * FROM events WHERE user_id = ?;`;
    const result = db.prepare(query).all(userData.user_id);
    return createResponse({ success: true, data: result });
  } catch (e) {
    return createResponse({ success: false, data: e.message }, 401);
  }
};
