import { checkbox, select } from "@inquirer/prompts";
import { BASE_URL } from "./utils.js";

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
  console.log(await response.text());
};

const userSubscription = () => {};
const createdEvents = () => {};

const profileOPtions = async (userData) => {
  const option = await select({
    message: "SELECT option",
    choices: [
      { name: "UPDATE PROFILE", value: update },
      { name: "SEE SUBSCRIPTIONS", value: userSubscription },
      { name: "SEE CREATED EVENTS", value: createdEvents },
    ],
  });
  await option(userData);
};

profileOPtions(userData);
