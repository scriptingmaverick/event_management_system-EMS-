import { createUpdateQuery, sendFailure, sendSuccess } from "../../utils.js";

export const updateUsernameOn = (db, userDetails, body) => {
  try {
    const [query, values] = createUpdateQuery(userDetails,body,"users","user_id");
    db.prepare(query).run(...values);

    return sendSuccess(`updated successfully`, 200);
  } catch {
    return sendFailure("Internal server error", 501);
  }
};
