import { select } from "@inquirer/prompts";
import { displayEvents, getChoices, userData } from "./profile_page.js";
import { BASE_URL } from "./utils.js";

const requestUnsubscribeFromEvent = async (event_id, user_id) => {
  const requestBody = JSON.stringify({ event_id, user_id });
  const response = await fetch(`${BASE_URL}/cancel-subscription`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: requestBody,
  });
  console.log(await response.text());
};

const formatSubscribedEvents = (events) => {
  console.log(events);
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
    console.log("No events found");
    return;
  }
  choices.push({ name: "Back", value: 0 });
  const selectedEvent = await select({
    message: "SELECT EVENT YOU WANT TO UNSUBSCRIBE",
    choices: choices,
  });
  if (selectedEvent === 0) {
    return;
  }
  requestUnsubscribeFromEvent(selectedEvent.event_id, userData.user_id);
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
  await option(subscribedEvents);
};

export const userSubscriptions = async () => {
  const response = await fetch(
    `${BASE_URL}/get-subscriptions?user_id=${userData.user_id}`,
  );
  const events = (await response.json()).data;
  const subscribedEvents = formatSubscribedEvents(events);
  displayEvents(subscribedEvents);
  await showSubscriptionActions(subscribedEvents);
};
