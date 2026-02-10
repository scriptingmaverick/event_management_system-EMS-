import { createUpdateQuery, sendFailure, sendSuccess } from "../../utils.js";

export const updateEvent = (db, eventId, body) => {
  const [query, values] = createUpdateQuery(
    { event_id: eventId },
    body,
    "events",
    "event_id",
  );

  try {
    db.prepare(query).run(...values);
    return sendSuccess("Event details updated", 202);
  } catch {
    return sendFailure("Interval server error", 501);
  }
};
