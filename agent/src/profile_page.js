// deno-lint-ignore-file no-unused-vars
import { checkbox, select } from "@inquirer/prompts";
import { BASE_URL, displayResponse } from "./utils.js";
import { homePage } from "./home_page.js";
import { userSubscriptions } from "./subscription_manager.js";
import { createdEvents } from "./manage_created_events.js";
import { red } from "jsr:@std/internal@^1.0.12/styles";

export const userData = JSON.parse(Deno.readTextFileSync("./user.json"));

const isValidPhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

const getNewValues = (fieldsToChange) => {
  const validation = {
    username: () => true,
    password: () => true,
    location: () => true,
    dob: () => true,
    phone: isValidPhone,
  };

  const newValues = {};
  fieldsToChange.forEach((field) => {
    let value;
    while (true) {
      value = prompt(`Enter new ${field}`);
      if (validation[field](value)) {
        break;
      }
      console.log(red(`Invalid ${field}`));
    }
    newValues[field] = value;
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
  await displayResponse(await response.json());
};

export const displayEvents = (events) => {
  console.table(events.map(({ event_id, ...eventData }) => eventData));
};

export const getChoices = (events) => {
  const choices = events.map((event) => ({
    name: event.event_title,
    value: event,
  }));
  return choices;
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
