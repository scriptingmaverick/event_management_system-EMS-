import { createResponse, selectMatchingUser } from "../../utils.js";

export const insertNewUserOn = (db, data) =>
  db.prepare("insert into users(email,password,username) values(?,?,?);").run(
    ...data,
  );

export const createUser = (db, body) => {
  try {
    const { email, password, username } = body;
    const users = selectMatchingUser(db, email);

    if (users.length >= 1) {
      return createResponse(
        { success: false, data: "Email already exists" },
        401,
      );
    }

    insertNewUserOn(db, [email, password, username]);
    return createResponse(
      { success: true, data: "User created successfully" },
      201,
    );
  } catch (e) {
    return createResponse({ success: false, data: e.message }, 501);
  }
};
