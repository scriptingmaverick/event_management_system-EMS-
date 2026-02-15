import { select } from "@inquirer/prompts";
import { BASE_URL, displayResponse } from "./utils.js";
import { handleSelectedEventType } from "./events_of_a_kind_page.js";

export const homePage = async () => {
  const response = await fetch(`${BASE_URL}/get-event-types`).then((x) =>
    x.json(),
  );

  if (!response.success) return displayResponse(response);

  const eventType = await select({
    message: "Select an event type",
    choices: response.data.map(({ type }) => ({
      name: type,
      value: type,
    })),
  });

  return await handleSelectedEventType(eventType);
};

homePage();
