import { select } from "@inquirer/prompts";
import { BASE_URL, displayHeaders, displayResponse } from "./utils.js";


const login = async () => {
  displayHeaders("LOGIN");
  const email = prompt("Enter email: ");
  const password = prompt("Enter password: ");

  const headers = { "content-type": "application/json" };
  const requestBody = JSON.stringify({ email, password });

  const request = { method: "POST", headers, body: requestBody };
  const res = await fetch(`${BASE_URL}/login`, request);

  return await res.json();
};

const signup = async () => {
  displayHeaders("SIGN UP");

  const username = prompt("Enter username: ");
  const email = prompt("Enter email: ");
  const password = prompt("Enter password: ");

  const headers = { "content-type": "application/json" };
  const requestBody = JSON.stringify({ username, email, password });

  const request = { method: "POST", headers, body: requestBody };
  const res = await fetch(`${BASE_URL}/sign-up`, request);

  return await res.json();
};

const routeOperation = async (option, response) => {
  if (!response.success) return mainPage();

  if (option !== signup) return response;

  const loginResponse = await login();

  if (loginResponse.success) return loginResponse;

  await displayResponse(loginResponse);
  return mainPage();
};

const mainPage = async () => {
  while (true) {
    console.clear();
    const mode = await select({
      message: "SELECT MODE",
      choices: [
        { "name": "LOGIN", "value": login },
        { "name": "SIGNUP", "value": signup },
        { "name": "EXIT", "value": Deno.exit },
      ],
    });

    const response = await mode();
    await displayResponse(response);
    return await routeOperation(mode, response);
  }
};

const main = async () => {
  console.log(await mainPage());
};

main();
