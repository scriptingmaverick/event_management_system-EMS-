import { selectMatchingUser, sendFailure, sendSuccess } from "../../utils.js";

export const insertNewUserOn = (DB, data) =>
  DB.prepare("insert into users(email,password,username) values(?,?,?);").run(
    ...data,
  );

export const createUser = (body, storage) => {
  const { email, password, username } = body;
  const users = selectMatchingUser(storage, email);

  if (users.length >= 1) return sendFailure("Email already exists", 401);

  insertNewUserOn(storage, [email, password, username]);

  return sendSuccess("User created successfully", 201);
};
