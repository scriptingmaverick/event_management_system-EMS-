import { createResponse, createUpdateQuery } from "../../utils.js";

export const cancelEvent = (db, body) => {
  const [query, values] = createUpdateQuery(
    { event_id: body.event_id },
    { status: "cancelled" },
    "events",
    "event_id",
  );

  try {
    db.prepare(query).run(...values);
    return createResponse({ success: true, data: "Event cancelled" });
  } catch (e) {
    return createResponse({ success: false, data: e.message }, 501);
  }
};
