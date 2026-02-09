import { describe, it } from "@std/testing";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import {
  insertNewUserOn,
  selectMatchingUser,
  sendSuccess,
  sendFailure,
  createUser,
} from "../../src/requests/create_user.js";

describe("testing createUser functionality with in-memory DB", () => {
  const db = new DatabaseSync(":memory:");
  const data = {
    email: "hello@gmail.com",
    username: "hello",
    password: "hi",
  };
  db.exec(
    "create table users(email text unique not null,password text not null,username text not null);",
  );

  describe("testing insertUser function", () => {
    it("testing with valid data", () => {
      const { email, username, password } = data;
      insertNewUserOn(db, [email, password, username]);
      const dataInDb = db.prepare("select * from users;").all();
      assertEquals(dataInDb, [data]);
    });

    it("testing with non matching arguments", () => {
      assertThrows(() => insertNewUserOn(db, "hello"));
    });
  });

  describe("testing selectMatchingUser function", () => {
    it("testing with non-existing user", () => {
      const result = selectMatchingUser(db, "hello@email.com");
      assertEquals(result, []);
    });

    it("testing with existing user", () => {
      const result = selectMatchingUser(db, "hello@gmail.com");
      assertEquals(result, [{ email: data.email }]);
    });
  });

  describe("testing response senders", () => {
    describe("testing sendSuccess", () => {
      it("testing with user given values", () => {
        const result = sendSuccess("done", 203);
        const response = new Response("done", { status: 203 });
        assertEquals(result.status, response.status);
        assertEquals(result.text(), response.text());
      });

      it("testing with Default values", () => {
        const result = sendSuccess();
        const response = new Response("success", { status: 200 });
        assertEquals(result.status, response.status);
        assertEquals(result.text(), response.text());
      });
    });

    describe("testing sendFailure", () => {
      it("testing with user given values", () => {
        const result = sendFailure("not done", 400);
        const response = new Response("not done", { status: 400 });
        assertEquals(result.status, response.status);
        assertEquals(result.text(), response.text());
      });

      it("testing with Default values", () => {
        const result = sendFailure();
        const response = new Response("not found", { status: 404 });
        assertEquals(result.status, response.status);
        assertEquals(result.text(), response.text());
      });
    });
  })

  describe("testing createUser function", () => {
    it("testing with non-existing userData",async () => {
      let { email, password, username } = data;
      email = "new@gmail.com";
      const body = { email, password, username };
      const response = createUser(body, db);
      assertEquals(response.status, 201);
      assertEquals(await response.text(),'User created successfully')
    });
    it("testing with existing userData",async () => {
     
      const response = createUser(data, db);
      assertEquals(response.status, 401);
      assertEquals(await response.text(),'Email already exists')
    });
  });
});
