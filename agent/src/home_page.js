import { select } from "@inquirer/prompts";
import { green, red } from "jsr:@std/internal@^1.0.12/styles";
import { sign } from "node:crypto";

const BASE_URL = "http://localhost:5050/";
const { columns: COLUMNS } = Deno.consoleSize();

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const formatHeaders = (msg) => {
  const pad = " ".repeat((COLUMNS / 4) - msg.length);
  return `${pad}==> \x1b[1m ${msg} \x1b[0m <==\n`;
};

const displayHeaders = (msg) => {
  console.clear();
  console.log(formatHeaders(msg));
};

const login = async () => {
  displayHeaders("LOGIN");
  const email = prompt("Enter email: ");
  const password = prompt("Enter password: ");

  const headers = { "content-type": "application/json" };
  const requestBody = JSON.stringify({ email, password });

  const request = { method: "POST", headers, body: requestBody };
  const res = await fetch(`${BASE_URL}login`, request);

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
  const res = await fetch(`${BASE_URL}sign-up`, request);

  return await res.json();
};

const formatResponse = (msg, success) => success ? green(msg) : red(msg);

const displayResponse = async ({ data, success }) => {
  console.log(formatResponse(data, success));
  await sleep(1500);
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
