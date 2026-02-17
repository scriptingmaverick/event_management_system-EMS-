import { select } from "@inquirer/prompts";
import { displayEvents, getChoices, userData } from "./profile_page.js";
import { BASE_URL, displayResponse } from "./utils.js";

const requestCancelEvent = async (event_id) => {
  const requestBody = JSON.stringify({ event_id });
  const response = await fetch(`${BASE_URL}/cancel-event`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: requestBody,
  });
  return JSON.parse(await response.text());
};

const cancelEvent = async (createdEvents) => {
  const choices = getChoices(createdEvents);
  if (choices.length === 0) {
    console.log("No events found");
    return;
  }

  choices.push({ name: "Back", value: 0 });
  const selectedEvent = await select({
    message: "SELECT EVENT YOU WANT TO CANCEl",
    choices: choices,
  });
  if (selectedEvent === 0) {
    return;
  }
  return await requestCancelEvent(selectedEvent.event_id);
};

const showCreationActions = async (createdEvents) => {
  const option = await select({
    message: "SELECT OPERATION",
    choices: [
      {
        name: "cancel event",
        value: cancelEvent,
        disabled: createdEvents.length === 0,
      },
      { name: "Back", value: 0 },
    ],
  });
  if (option === 0) {
    return;
  }
  return await cancelEvent(createdEvents);
};

const formatCreatedEvents = (createdEvents) => {
  return createdEvents.map(
    ({ event_id, event_title, status, location, event_date }) => {
      return { event_id, event_title, status, location, event_date };
    },
  );
};

export const createdEvents = async () => {
  const data = await fetch(
    `${BASE_URL}/get-creations?user_id=${userData.user_id}`,
  );
  const events = (await data.json()).data;
  const formattedEvents = formatCreatedEvents(events);
  displayEvents(formattedEvents);
  const response = await showCreationActions(formattedEvents);
  console.log("dsijk", response);
  await displayResponse(response);
};
