import { describe, it } from "@std/testing";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { createUser, insertNewUserOn } from "../../src/requests/create_user.js";
import { deleteUser, deleteUserFrom } from "../../src/requests/delete_user.js";

describe("testing deleteUser functionality with in-memory DB", () => {
  const db = new DatabaseSync(":memory:");
  const data = {
    email: "hello@gmail.com",
    username: "hello",
    password: "hi",
  };
  db.exec(
    "create table users(user_id INTEGER PRIMARY KEY AUTOINCREMENT,email text unique not null,password text not null,username text not null);",
  );

  describe("testing deleteUserFrom function", () => {
    it("testing with valid data", () => {
      const { email, username, password } = data;
      insertNewUserOn(db, [email, password, username]);
      deleteUserFrom(db, 1);
      const dataInDb = db.prepare("select * from users;").all();
      assertEquals(dataInDb, []);
    });

    it("testing without db", () => {
      assertThrows(() => deleteUserFrom("hello"));
    });
  });

  describe("testing deleteUser function", () => {
    it("testing with existing userData", async () => {
      let { email, password, username } = data;
      email = "new@gmail.com";
      const body = { email, password, username };
      insertNewUserOn(db, [body.email, body.password, body.username]);
      const response = deleteUser(db, { user_id: 2 });
      assertEquals(response.status, 200);
      assertEquals(await response.text(), "Account deletion successful");
    });

    it("testing with non-existing userData", async () => {
      const response = deleteUser(db, data);
      assertEquals(response.status, 501);
      assertEquals(await response.text(), "Internal server error");
    });
  });
});
