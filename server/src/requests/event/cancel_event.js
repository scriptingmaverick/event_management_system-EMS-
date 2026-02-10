import { createUpdateQuery, sendFailure, sendSuccess } from "../../utils.js";

export const cancelEvent = (db, body) => {
  const [query, values] = createUpdateQuery(
    { event_id: body.event_id },
    { status: "cancelled" },
    "events",
    "event_id",
  );

  try {
    db.prepare(query).run(...values);
    return sendSuccess("Event cancelled", 200);
  } catch (e) {
    return sendFailure(e.message, 501);
  }
};
