import { createResponse } from "../../utils.js";

export const changeUserStatus = (db, userData) => {
  try{
    const query = `UPDATE users SET is_premium_user = 1 where user_id = ?`;
    db.prepare(query).run(userData.user_id);
    return createResponse({ success: true, data: "Updated successfully" });
  } catch(e) {
    return createResponse({success:false, data: e.message}, 501)
  }
};
