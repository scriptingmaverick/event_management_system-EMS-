import {
  createResponse,
  saveToFile,
  selectMatchingUser
} from "../../utils.js";

export const updateUserLogin = (db, email) =>
  db.prepare("update users set last_login = ? where email = ?;").run(
    new Date().toLocaleString(),
    email,
  );

export const login = (db, body) => {
  const { email, password } = body;
  try {
    const [user] = selectMatchingUser(db, email);
    if (!user) {
      return createResponse({ success: false, data: "User not found" }, 404);
    }

    if (user.password !== password) {
      return createResponse({
        success: false,
        data: "Credentials aren't correct",
      }, 400);
    }

    updateUserLogin(db, email);
    const userData = selectMatchingUser(db, email)[0];
    saveToFile(userData);

    return createResponse({ success: true, data: "User Login successful" });
  } catch (e) {
    return createResponse({ success: false, data: e.message }, 501);
  }
};
