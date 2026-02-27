import { select } from "@inquirer/prompts";
import { homePage } from "./home_page.js";
import { BASE_URL, display, displayResponse, getCurrentUser } from "./utils.js";

export const createChoices = (data) => {
  const choices = [
    {
      name: "event_title\t\ttype\t\tevent_date",
      value: null,
      disabled: true,
    },
    ...data.map(({ event_title, type, event_date, event_id }) => ({
      name: `${event_title}\t\t${type}\t\t${event_date}`,
      value: event_id,
    })),
  ];

  return choices;
};

export const handleEventSelection = async (data) => {
  const choices = createChoices(data);

  const event_id = await select({
    message: "select an event to check details",
    choices,
  });

  const event = data.find((x) => x.event_id === event_id);
  display(event);

  return await handleNextStep(event);
};

export const subscribe = async ({ event_id }) => {
  const { user_id } = await getCurrentUser();

  const response = await fetch(BASE_URL + "/subscribe", {
    method: "POST",
    body: JSON.stringify({ user_id, event_id }),
    headers: { "content-type": "application/json" },
  }).then((x) => x.json());

  await displayResponse(response);

  if (!response.success) return;

  await homePage();
};

export const handleNextStep = async (event) => {
  const user_action = await select({
    message: "select next step",
    choices: [
      { name: "subscribe this event", value: "subscribe" },
      { name: "back", value: "back" },
    ],
  });

  const actions = {
    subscribe: subscribe,
    back: homePage,
  };

  return await actions[user_action](event);
};
