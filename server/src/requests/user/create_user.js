import { selectMatchingUser, sendFailure, sendSuccess } from "../../utils.js";

export const insertNewUserOn = (db, data) =>
  db.prepare("insert into users(email,password,username) values(?,?,?);").run(
    ...data,
  );

export const createUser = (db, body) => {
  const { email, password, username } = body;
  const users = selectMatchingUser(db, email);

  if (users.length >= 1) return sendFailure("Email already exists", 401);

  insertNewUserOn(db, [email, password, username]);

  return sendSuccess("User created successfully", 201);
};
