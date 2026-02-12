import { createResponse, createUpdateQuery, saveToFile } from "../../utils.js";

const selectMatchingUser = (db, userId) =>
  db.prepare(`select * from users where user_id = ?;`).all(userId);

export const updateUser = (db, body) => {
  try {
    const { user_id } = body;
    delete body["user_id"];

    const [query, values] = createUpdateQuery(
      { user_id },
      body,
      "users",
      "user_id",
    );
    db.prepare(query).run(...values);
    const newData = selectMatchingUser(db, user_id)[0];
    saveToFile(newData);

    return createResponse({ success: true, data: `updated successfully` });
  } catch (e) {
    return createResponse({ success: true, data: e.message }, 501);
  }
};
