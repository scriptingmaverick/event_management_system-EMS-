import { sendFailure, sendSuccess } from "../../utils.js";

export const updateEnrollment = (db, lookUpValues) => {
  return db.prepare(
    `UPDATE enrollments SET status = 'cancelled' where event_id = ? and user_id = ?`,
  ).run(...lookUpValues);
};

export const cancelEnrollment = (db, body) => {
  try {
    const values = Object.values(body);
    updateEnrollment(db, values);
    return sendSuccess("Cancelled successfully", 200)
  } catch(e) {
    return sendFailure(e.message, 401)
  }
};
