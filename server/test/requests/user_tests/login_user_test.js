import { beforeAll, describe, it } from "@std/testing";
import { assertEquals } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { login } from "../../../src/requests/user/login_user.js";
import { insertNewUserOn } from "../../../src/requests/user/create_user.js";

describe("testing Login functionality with in-memory DB", () => {
  let db, data;
  beforeAll(() => {
    db = new DatabaseSync(":memory:");
    data = {
      email: "hello@gmail.com",
      password: "hi",
      username: "hello",
    };
    
    db.exec(
      "create table users(email text unique not null,password text not null,username text not null,last_login text);",
    );

    const { email, username, password } = data;
    insertNewUserOn(db, [email, password, username]);
  });

  describe("testing login function", () => {
    it("testing with non-existing userData", async () => {
      let { email, password } = data;
      email = "new@gmail.com";
      const body = { email, password };
      const response = login(db, body);
      assertEquals(response.status, 404);
      assertEquals((await response.json()).data, "User not found");
    });

    it("testing with existing userData", async () => {
      const response = login(db, data);
      assertEquals((await response.json()).data, "User Login successful");
      assertEquals(response.status, 200);
    });

    it("testing with existing userData but with wrong password", async () => {
      const response = login(db, { email: data.email, password: "hello" });
      assertEquals((await response.json()).data, "Credentials aren't correct");
      assertEquals(response.status, 400);
    });
  });
});
