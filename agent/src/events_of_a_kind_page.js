import { handleEventSelection } from "./specific_event_page.js";
import { BASE_URL, displayResponse } from "./utils.js";

export const handleSelectedEventType = async (eventType) => {
  const url = `${BASE_URL}/get-events?type=${eventType}`;
  const { data, success } = await fetch(url).then((x) => x.json());

  if (!success) return displayResponse({ data, success });

  return await handleEventSelection(data);
};
