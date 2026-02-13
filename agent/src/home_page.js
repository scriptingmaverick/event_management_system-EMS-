import { select } from "@inquirer/prompts";
import { BASE_URL, displayResponse } from "./utils.js";

export const displayEvents = async (eventType) => {
  const url = `${BASE_URL}/get-events?type=${eventType}`;
  const { data, success } = await fetch(url).then((x) => x.json());

  console.log({ data, success });
  // const choices  = data.map(())
};

export const home = async () => {
  const response = await fetch(`${BASE_URL}/get-event-types`).then((x) =>
    x.json()
  );

  if (!response.success) return displayResponse(response);

  const choices = response.data.map(({ type }) => ({
    name: type,
    value: type,
  }));

  const eventType = await select({
    message: "Select an event type",
    choices,
  });

  return await displayEvents(eventType);
};

home();
