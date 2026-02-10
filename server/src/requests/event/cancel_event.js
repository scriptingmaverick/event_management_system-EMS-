import { createUpdateQuery, sendFailure, sendSuccess } from "../../utils.js";

export const cancelEvent = (db, eventId) => {
  const [query, values] = createUpdateQuery(
    { event_id: eventId },
    { status: "cancelled" },
    "events",
    "event_id",
  );

  try {
    db.prepare(query).run(...values);
    return sendSuccess("Event cancelled", 200);
  } catch {
    return sendFailure("Interval server error", 501);
  }
};
