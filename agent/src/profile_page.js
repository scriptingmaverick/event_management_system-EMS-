// deno-lint-ignore-file no-unused-vars
import { checkbox, select } from "@inquirer/prompts";
import { BASE_URL, displayResponse } from "./utils.js";
import { homePage } from "./home_page.js";
import { userSubscriptions } from "./subscription_manager.js";
import { createdEvents } from "./manage_created_events.js";

export const userData = JSON.parse(Deno.readTextFileSync("./user.json"));

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
