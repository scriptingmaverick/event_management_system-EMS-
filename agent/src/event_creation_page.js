import { input } from "@inquirer/prompts";
import { BASE_URL, displayResponse, getCurrentUser } from "./utils.js";

export const eventCreationPage = async () => {
  const fields = [
    "event_title",
    "type",
    "description",
    "location",
    "entry_fee",
    "capacity",
    "event_date",
  ];

  const event_data = {};

  for await (const field of fields) {
    const value = await input({ message: `Enter ${field}`, required: true });

    event_data[field] = value;
    console.log();
  }

  const { user_id } = await getCurrentUser();
  event_data["user_id"] = user_id;

  const response = await fetch(BASE_URL + "/create-event", {
    method: "POST",
    body: JSON.stringify(event_data),
    headers: {
      "content-type": "application/json",
    },
  }).then((x) => x.json());

  await displayResponse(response);
};

eventCreationPage();
