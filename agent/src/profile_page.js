// deno-lint-ignore-file no-unused-vars
import { checkbox, select } from "@inquirer/prompts";
import { BASE_URL, displayResponse } from "./utils.js";
import { homePage } from "./home_page.js";

const userData = JSON.parse(Deno.readTextFileSync("./user.json"));

const getNewValues = (fieldsToChange) => {
  const newValues = {};
  fieldsToChange.forEach((field) => {
    newValues[field] = prompt(`Enter new ${field}`);
  });
  return newValues;
};

const update = async () => {
  const changeableFields = [
    { name: "username", value: "username" },
    { name: "password", value: "password" },
    { name: "dob", value: "dob" },
    { name: "location", value: "location" },
    { name: "phone", value: "phone" },
  ];

  const fieldsToChange = await checkbox({
    message: "Which fields do you really change? ",
    choices: changeableFields,
  });

  const requestBody = getNewValues(fieldsToChange);
  requestBody["user_id"] = 1;
  const response = await fetch(`${BASE_URL}/update-user`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  displayResponse(await response.json());
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

const displayEvents = (events) => {
  console.table(events.map(({ event_id, ...eventData }) => eventData));
};

const requestUnsubscribeFromEvent = async (event_id, user_id) => {
  const requestBody = JSON.stringify({ event_id, user_id });
  const response = await fetch(`${BASE_URL}/cancel-enrollment`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: requestBody,
  });
  console.log(await response.text());
};

const getChoices = (events) => {
  const choices = events.map((event) => ({
    name: event.event_title,
    value: event,
  }));
  return choices;
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
      { name: "unsubscribe to an event", value: unsubscribeEvent },
      { name: "BACK", value: 0 },
    ],
  });
  if (option === 0) {
    return;
  }
  await option(subscribedEvents);
};

const userSubscriptions = async () => {
  const response = await fetch(
    `${BASE_URL}/get-subscriptions?user_id=${userData.user_id}`,
  );
  const events = (await response.json()).data;
  const subscribedEvents = formatSubscribedEvents(events);
  displayEvents(subscribedEvents);
  await showSubscriptionActions(subscribedEvents);
};

const requestCancelEvent = async (event_id) => {
  const requestBody = JSON.stringify({ event_id });
  const response = await fetch(`${BASE_URL}/cancel-event`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: requestBody,
  });
  console.log(await response.text());
};

const cancelEvent = async (createdEvents) => {
  const choices = getChoices(createdEvents);
  if (choices.length === 0) {
    console.log("No events found");
    return;
  }
  console.log({ choices });
  choices.push({ name: "Back", value: 0 });
  const selectedEvent = await select({
    message: "SELECT EVENT YOU WANT TO CANCEl",
    choices: choices,
  });
  if (selectedEvent === 0) {
    return;
  }
  await requestCancelEvent(selectedEvent.event_id);
};

const showCreationActions = async (createdEvents) => {
  const option = await select({
    message: "SELECT OPERATION",
    choices: [
      { name: "cancel event", value: cancelEvent },
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

const createdEvents = async () => {
  const response = await fetch(
    `${BASE_URL}/get-creations?user_id=${userData.user_id}`,
  );
  const events = (await response.json()).data;
  const formattedEvents = formatCreatedEvents(events);
  displayEvents(formattedEvents);
  await showCreationActions(formattedEvents);
};

export const profileOptions = async (userData) => {
  console.clear();

  while (true) {
    const option = await select({
      message: "SELECT option",
      choices: [
        { name: "UPDATE PROFILE", value: update },
        { name: "SEE SUBSCRIPTIONS", value: userSubscriptions },
        { name: "SEE CREATED EVENTS", value: createdEvents },
        { name: "BACK", value: 0 },
      ],
    });

    console.clear();
    if (option === 0) {
      return;
    }
    await option(userData);
  }
};
