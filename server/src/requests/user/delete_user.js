import {
  createResponse,
  saveToFile,
} from "../../utils.js";

export const deleteUserFrom = (db, userId) =>
  db.prepare("delete from users where user_id = ?;").run(userId);

export const deleteUser = (db, body) => {
  const { user_id } = body;
  try {
    deleteUserFrom(db, user_id);
    saveToFile({});
    return createResponse({
      success: true,
      data: "Account deletion successful",
    });
  } catch (e) {
    return createResponse({ success: false, data: e.message }, 501);
  }
};
