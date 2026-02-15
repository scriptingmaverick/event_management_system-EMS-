// deno-lint-ignore-file no-unused-vars
import { checkbox, select } from "@inquirer/prompts";
import { BASE_URL, displayResponse } from "./utils.js";

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
    ({ event_id, event_title, status, event_date, location }) => {
      return { event_id, event_title, status, event_date, location };
    },
  );
};

const displaySubscribedEvents = (subscribedEvents) => {
  console.table(
    subscribedEvents.map(({ event_id, ...eventData }) => eventData),
  );
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

const unsubscribeEvent = async (subscribedEvents) => {
  const selectedEvent = await select({
    message: "SELECT EVENT YOU WANT TO UNSUBSCRIBE",
    choices: subscribedEvents.map((event) => ({
      name: event.event_title,
      value: event,
    })),
  });
  requestUnsubscribeFromEvent(selectedEvent.event_id, userData.user_id);
};

const showSubscriptionActions = async (subscribedEvents) => {
  const option = await select({
    message: "SELECT OPERATION",
    choices: [
      { name: "unsubscribe to an event", value: unsubscribeEvent },
    ],
  });
  await option(subscribedEvents);
};

const userSubscriptions = async () => {
  const response = await fetch(
    `${BASE_URL}/get-subscriptions?user_id=${userData.user_id}`,
  );
  const events = (await response.json()).data;
  const subscribedEvents = formatSubscribedEvents(events);
  displaySubscribedEvents(subscribedEvents);
  showSubscriptionActions(subscribedEvents);
};

const createdEvents = () => {};

const profileOPtions = async (userData) => {
  const option = await select({
    message: "SELECT option",
    choices: [
      { name: "UPDATE PROFILE", value: update },
      { name: "SEE SUBSCRIPTIONS", value: userSubscriptions },
      { name: "SEE CREATED EVENTS", value: createdEvents },
    ],
  });
  await option(userData);
};

profileOPtions(userData);
