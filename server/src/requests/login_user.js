import { selectMatchingUser, sendFailure, sendSuccess } from "../utils.js";

export const updateUserLogin = (DB, email) =>
  DB.prepare("update users set last_login = ? where email = ?;").run(
    new Date().toISOString,
    email,
  );

export const login = (body, storage) => {
  const { email, password } = body;
  const user = selectMatchingUser(storage, email);

  if (user.length === 0) return sendFailure("User not found", 404);

  if (user.password !== password)
    return sendFailure("Credentials aren't correct", 400);

  updateUserLogin(storage, email);

  return sendSuccess("User Login successful");
};
