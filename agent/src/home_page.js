import { select, Separator } from "@inquirer/prompts";
import { BASE_URL, displayResponse } from "./utils.js";
import { handleSelectedEventType } from "./events_of_a_kind_page.js";
import { profileOptions } from "./profile_page.js";
import { mainPage } from "./start_page.js";

export const formatChoices = (response) => {
  const choices = response.data.map(({ type }) => ({
    name: type,
    value: type,
  }));
  choices.push(new Separator("\n==> pages <==\n"));
  choices.push({ name: "Manage Profile", value: profileOptions });
  choices.push({ name: "Log out", value: mainPage });

  return choices;
};

export const homePage = async () => {
  console.clear();

  while (true) {
    const response = await fetch(`${BASE_URL}/get-event-types`).then((x) =>
      x.json()
    );

    if (!response.success) return displayResponse(response);
    const choices = formatChoices(response);

    const eventType = await select({
      message: "Select an event type",
      choices,
      pageSize: choices.length + 2,
    });

    if (typeof eventType !== "function") {
      await handleSelectedEventType(eventType);
      continue;
    }

    await eventType();
  }
};
