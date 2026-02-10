import { createUser } from "./user/create_user.js";
import { deleteUser } from "./user/delete_user.js";
import { login } from "./user/login_user.js";
import { updateUser } from "./user/update_user.js";
import { createEvent } from "./event/create_event.js";
import { updateEvent } from "./event/update_event.js";
import { cancelEvent } from "./event/cancel_event.js";
import { DatabaseSync } from "node:sqlite";
import { createEnrollment } from "./enrollment/create_enrollment.js";
import { cancelEnrollment } from "./enrollment/cancel_enrollment.js";

export const createBody = async (method, request) => {
  if (method === "POST") {
    const contentType = request.headers.get("content-type");
    return await getBody(request, contentType);
  }

  return "";
};

export const getBody = (request, contentType) =>
  contentType === "application/json" ? request.json() : request.text();

export const parse = async (request) => {
  const { origin: baseUrl, pathname: path } = new URL(request.url);
  const { method } = request;
  const body = await createBody(method, request);

  return { body, baseUrl, path, method };
};

const createTables = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    last_login TEXT,
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
    status TEXT DEFAULT('confirmed'),
    created_at TEXT DEFAULT(DATETIME('now','localtime')),

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
    "/enroll": createEnrollment,
    "/cancel-enrollment": cancelEnrollment,
  };

  return apisToFns[path](db, body);
};
