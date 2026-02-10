import { sendFailure, sendSuccess } from "../utils.js";

export const deleteUserFrom = (db, userId) =>
  db.prepare("delete from users where user_id = ?;").run(userId);

export const deleteUser = (db, userData) => {
  const { user_id } = userData;
  try {
    deleteUserFrom(db, user_id);
    return sendSuccess("Account deletion successful");
  } catch (e) {
    return sendFailure("Internal server error", 501);
  }
};
