import {
  saveToFile,
  selectMatchingUser,
  sendFailure,
  sendSuccess,
} from "../../utils.js";

export const updateUserLogin = (db, email) =>
  db.prepare("update users set last_login = ? where email = ?;").run(
    new Date().toLocaleString(),
    email,
  );

export const login = (db, body) => {
  const { email, password } = body;
  const [user] = selectMatchingUser(db, email);

  if (!user) return sendFailure("User not found", 404);

  if (user.password !== password) {
    return sendFailure("Credentials aren't correct", 400);
  }

  updateUserLogin(db, email);

  const userData = selectMatchingUser(db, email)[0];
  saveToFile(userData);

  return sendSuccess("User Login successful");
};
