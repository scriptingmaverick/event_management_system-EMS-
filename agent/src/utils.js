import { green, red } from "jsr:@std/internal@^1.0.12/styles";

export const BASE_URL = "http://localhost:5050";
export const { columns: COLUMNS } = Deno.consoleSize();

export const getCurrentUser = async () =>
  await Deno.readTextFile("./user.json").then(JSON.parse);

export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const formatHeaders = (msg) => {
  const pad = " ".repeat(COLUMNS / 4 - msg.length);
  return `${pad}==> \x1b[1m ${msg} \x1b[0m <==\n`;
};

export const displayHeaders = (msg) => {
  console.clear();
  console.log(formatHeaders(msg));
};

export const formatResponse = (msg, success) =>
  success ? green(msg) : red(msg);

export const displayResponse = async ({ data, success }) => {
  console.log(formatResponse(data, success));
  await sleep(1500);
};

export const display = ({
  event_title,
  description,
  type,
  location,
  entry_fee,
  attendees,
  event_date,
}) =>
  console.table({
    event_title,
    description,
    type,
    location,
    entry_fee,
    attendees,
    event_date,
  });
