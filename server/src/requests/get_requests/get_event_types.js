import { createResponse } from "../../utils.js";

export const getEventTypes = (db) => {
  const query = `select distinct(type) from events;`;
  try {
    const data = db.prepare(query).all();
    const response = createResponse({ success: true, data });
    return response;
  } catch {
    const data = "Internal server error";
    const response = createResponse({ success: false, data }, 501);
    return response;
  }
};
