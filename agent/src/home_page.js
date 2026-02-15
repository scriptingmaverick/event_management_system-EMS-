import { select } from "@inquirer/prompts";
import { BASE_URL, displayResponse } from "./utils.js";

export const createChoices = (data) => {
  const choices = data.map(({ event_title, type, event_date, event_id }) => ({
    name: `${event_title}\t\t${type}\t\t${event_date}`,
    value: event_id,
  }));

  choices.unshift({
    name: "event_title\t\ttype\t\tevent_date",
    value: null,
    disabled: true,
  });

  return choices;
};

export const display = ({
  event_title,
  description,
  type,
  location,
  entry_fee,
  attendees,
  event_date,
}) =>
  console.table({
    event_title,
    description,
    type,
    location,
    entry_fee,
    attendees,
    event_date,
  });

export const handleEventSelection = async (data) => {
  const choices = createChoices(data);

  const event_id = await select({
    message: "select an event to check details",
    choices,
  });

  return data.find((x) => x.event_id === event_id);
};

export const subscribe = async ({ event_id }) => {
  const { user_id } = await Deno.readTextFile("../../user.json").then((x) =>
    JSON.parse(x),
  );

  const response = await fetch(BASE_URL + "/subscribe", {
    method: "POST",
    body: JSON.stringify({ user_id, event_id }),
    headers: { "content-type": "application/json" },
  }).then((x) => x.json());

  if (!response.success) return displayResponse(response);

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

export const displayEvents = async (eventType) => {
  const url = `${BASE_URL}/get-events?type=${eventType}`;
  const { data, success } = await fetch(url).then((x) => x.json());

  if (!success) return displayResponse({ data, success });

  const event = await handleEventSelection(data);
  display(event);

  return await handleNextStep(event);
};

export const homePage = async () => {
  const response = await fetch(`${BASE_URL}/get-event-types`).then((x) =>
    x.json(),
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

homePage();
