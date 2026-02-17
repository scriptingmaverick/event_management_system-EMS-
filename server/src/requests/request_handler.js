import { createUser } from "./user/create_user.js";
import { deleteUser } from "./user/delete_user.js";
import { changeUserStatus } from "./user/purchase_premium.js";
import { login } from "./user/login_user.js";
import { updateUser } from "./user/update_user.js";
import { createEvent } from "./event/create_event.js";
import { updateEvent } from "./event/update_event.js";
import { cancelEvent } from "./event/cancel_event.js";
import { DatabaseSync } from "node:sqlite";
import { subscribe } from "./subscription_handler/subscribe.js";
import { unsubscribe } from "./subscription_handler/unsubscribe.js";
import { getEventTypes } from "./get_requests/get_event_types.js";
import { getEventsByType } from "./get_requests/get_events.js";
import { getCreatedEvents } from "./get_requests/get_event_creations.js";
import { getSubscribedEvents } from "./get_requests/get_user_enrollments.js";

export const parseSearchParams = (request) => {
  const requestPath = request.url;
  const searchParams = requestPath.slice(requestPath.indexOf("?"));
  const params = new URLSearchParams(searchParams);

  const body = {};
  for (const [key, value] of params) {
    body[key] = value;
  }

  return body;
};

export const getBody = (request, contentType) =>
  contentType === "application/json" ? request.json() : request.text();

export const parse = async (request) => {
  const { origin: baseUrl, pathname: path } = new URL(request.url);
  const { method } = request;
  const body = await createBody(method, request);

  return { body, baseUrl, path, method };
};

export const createBody = async (method, request) => {
  if (method === "POST") {
    const contentType = request.headers.get("content-type");
    return await getBody(request, contentType);
  }

  const body = parseSearchParams(request);
  return body;
};

const createTables = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    location TEXT,
    dob TEXT,
    phone TEXT,
    last_login TEXT,
    is_premium_user INTEGER NOT NULL DEFAULT 0 CHECK (is_premium_user IN (0,1)),
    created_at DEFAULT (DATETIME('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS events(
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_title TEXT,
    description TEXT,
    type TEXT,
    status TEXT,
    location TEXT,
    capacity INTEGER,
    entry_fee INTEGER,
    attendees INTEGER DEFAULT(0),
    event_date DEFAULT (DATETIME('now','localtime')),
    created_at DEFAULT (DATETIME('now','localtime')),
    updated_at DEFAULT (DATETIME('now','localtime')),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS enrollments(
    event_id INTEGER,
    user_id INTEGER,
    enrollment_status TEXT DEFAULT('confirmed'),
    enrolled_at TEXT DEFAULT(DATETIME('now','localtime')),

    PRIMARY KEY(event_id, user_id),
    FOREIGN KEY(event_id) REFERENCES events(event_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
    );
    `);
};

export const requestHandler = async (request) => {
  const { method, baseUrl, path, body } = await parse(request);

  console.log({ method, baseUrl, path, body });

  const db = new DatabaseSync("../db/ems.db");
  createTables(db);

  const apisToFns = {
    "/sign-up": createUser,
    "/login": login,
    "/delete-account": deleteUser,
    "/update-user": updateUser,
    "/create-event": createEvent,
    "/update-event": updateEvent,
    "/cancel-event": cancelEvent,
    "/subscribe": subscribe,
    "/cancel-subscription": unsubscribe,
    "/get-event-types": getEventTypes,
    "/get-events": getEventsByType,
    "/get-creations": getCreatedEvents,
    "/get-subscriptions": getSubscribedEvents,
    "/purchase-premium": changeUserStatus,
  };
  console.log(path);

  return apisToFns[path](db, body);
};
