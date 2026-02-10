import { sendFailure, sendSuccess } from "../../utils.js";

export const createQuery = (userDetails, body) => {
  const query = [];
  const values = [];
  query.push("UPDATE users SET");
  for (const [column, value] of Object.entries(body)) {
    query.push(`${column} = ?,`);
    values.push(value);
  }
  query.push(query.pop().slice(0, -1));
  query.push(`WHERE user_id = ?`);
  values.push(userDetails.user_id);
  return [query.join(" "), values];
};

export const updateUsernameOn = (db, userDetails, body) => {
  try {
    const [query, values] = createQuery(userDetails, body);
    db.prepare(query).run(...values);

    return sendSuccess(`updated successfully`, 200);
  } catch {
    return sendFailure("Internal server error", 501);
  }
};
