import { input, password, select } from "@inquirer/prompts";
import { BASE_URL, displayHeaders, displayResponse } from "./utils.js";
import { homePage } from "./home_page.js";

const login = async () => {
  displayHeaders("LOGIN");
  const email = await input({ message: "Enter email: " });
  const user_password = await password({ message: "Enter password: " });

  const headers = { "content-type": "application/json" };
  const requestBody = JSON.stringify({ email, password: user_password });

  const request = { method: "POST", headers, body: requestBody };
  const res = await fetch(`${BASE_URL}/login`, request);

  return await res.json();
};

const signup = async () => {
  displayHeaders("SIGN UP");

  const username = await input({ message: "Enter username: " });
  const email = await input({ message: "Enter email: " });
  const user_password = await password({ message: "Enter password: " });

  const headers = { "content-type": "application/json" };
  const requestBody = JSON.stringify({
    username,
    email,
    password: user_password,
  });

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
};

export const mainPage = async () => {
  console.clear();
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
    await routeOperation(mode, response);
    await homePage();
  }
};

mainPage();
