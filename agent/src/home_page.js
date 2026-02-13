import { BASE_URL, displayResponse } from "./utils.js";

export const home = async () => {
  const response = await fetch(`${BASE_URL}/get-event-types`).then((x) =>
    x.json()
  );

  if (!response.success) return displayResponse(response);

  const events = response.data;

  console.log({ response, events });
};

home();
