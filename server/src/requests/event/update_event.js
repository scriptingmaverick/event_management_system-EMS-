import { createResponse, createUpdateQuery } from "../../utils.js";

export const updateEvent = (db, body) => {
  const { event_id } = body;
  delete body["event_id"];

  const [query, values] = createUpdateQuery(
    { event_id },
    body,
    "events",
    "event_id",
  );

  try {
    db.prepare(query).run(...values);
    return createResponse(
      { success: false, data: "Event details updated" },
      202,
    );
  } catch (e) {
    return createResponse({ success: false, data: e.message }, 501);
  }
};
