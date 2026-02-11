import { createResponse } from "../../utils.js";

export const getEventsByType = (db, body) => {
  const query = `select * from events where type = ?;`;
  try {
    const data = db.prepare(query).all(body.type);
    const response = createResponse({ success: true, data });
    return response;
  } catch (e) {
    const response = createResponse({ success: false, data: e.message }, 501);
    return response;
  }
};
