import { BASE_URL } from "./utils.js";

export const home = async () => {
  const eventTypes = await fetch(`${BASE_URL}/`)
}