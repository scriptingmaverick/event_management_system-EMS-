import { beforeAll, describe, it } from "@std/testing";
import { assertEquals } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { insertNewUserOn } from "../src/requests/user/create_user.js";
import { selectMatchingUser, sendFailure, sendSuccess } from "../src/utils.js";

describe("testing utils", () => {
  let db, data;
  beforeAll(() => {
    db = new DatabaseSync(":memory:");
    data = {
      email: "hello@gmail.com",
      password: "hi",
      username: "hello",
    };

    db.exec(
      "create table users(email text unique not null,password text not null,username text not null);",
    );
    const { email, username, password } = data;
    insertNewUserOn(db, [email, password, username]);
  });

  describe("testing selectMatchingUser function", () => {
    it("testing with non-existing user", () => {
      const result = selectMatchingUser(db, "hello@email.com");
      assertEquals(result, []);
    });

    it("testing with existing user", () => {
      const result = selectMatchingUser(db, "hello@gmail.com")[0];
      assertEquals({email: result.email}, {email:data.email} );
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
  });
});
