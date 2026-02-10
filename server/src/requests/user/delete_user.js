import { saveToFile, sendFailure, sendSuccess } from "../../utils.js";

export const deleteUserFrom = (db, userId) =>
  db.prepare("delete from users where user_id = ?;").run(userId);

export const deleteUser = (db, body) => {
  const { user_id } = body;
  try {
    deleteUserFrom(db, user_id);
    saveToFile({});
    return sendSuccess("Account deletion successful");
  } catch (e) {
    return sendFailure(e.message, 501);
  }
};
