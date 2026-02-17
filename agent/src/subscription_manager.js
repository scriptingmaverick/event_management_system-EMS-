import { select } from "@inquirer/prompts";
import { displayEvents, getChoices, userData } from "./profile_page.js";
import { BASE_URL, displayResponse } from "./utils.js";

const requestUnsubscribeFromEvent = async (event_id, user_id) => {
  const requestBody = JSON.stringify({ event_id, user_id });
  const response = await fetch(`${BASE_URL}/cancel-subscription`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: requestBody,
  });
  return JSON.parse(await response.text());
};

const formatSubscribedEvents = (events) => {
  return events.map(
    (
      {
        event_id,
        event_title,
        status,
        event_date,
        location,
        enrollment_status,
      },
    ) => {
      return {
        event_id,
        event_title,
        event_status: status,
        enrollment_status,
        event_date,
        location,
      };
    },
  );
};

const unsubscribeEvent = async (subscribedEvents) => {
  const choices = getChoices(subscribedEvents);
  if (choices.length === 0) {
    return { success: false, data: "No events found" };
  }
  choices.push({ name: "Back", value: 0 });
  const selectedEvent = await select({
    message: "SELECT EVENT YOU WANT TO UNSUBSCRIBE",
    choices: choices,
  });
  if (selectedEvent === 0) {
    return;
  }
  return await requestUnsubscribeFromEvent(
    selectedEvent.event_id,
    userData.user_id,
  );
};

const showSubscriptionActions = async (subscribedEvents) => {
  const option = await select({
    message: "SELECT OPERATION",
    choices: [
      {
        name: "unsubscribe to an event",
        value: unsubscribeEvent,
        disabled: subscribedEvents.length === 0,
      },
      { name: "BACK", value: 0 },
    ],
  });
  if (option === 0) {
    return;
  }
  return await option(subscribedEvents);
};

export const userSubscriptions = async () => {
  const data = await fetch(
    `${BASE_URL}/get-subscriptions?user_id=${userData.user_id}`,
  );
  const events = (await data.json()).data;
  const subscribedEvents = formatSubscribedEvents(events);
  displayEvents(subscribedEvents);
  const response = await showSubscriptionActions(subscribedEvents);
  await displayResponse(response);
};
