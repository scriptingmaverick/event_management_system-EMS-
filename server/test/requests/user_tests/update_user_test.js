import { describe, it } from "@std/testing";
import { assertEquals } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { updateUsernameOn } from "../../../src/requests/user/update_user.js";
import { createUpdateQuery } from "../../../src/utils.js";

describe("testing update user functionality", () => {
  const db = new DatabaseSync(":memory:");
  const data = { user_id: 1, username: "karthik" };
  db.exec(
    "create table users(user_id integer primary key autoincrement, email text unique not null,password text not null,username text not null);",
  );
  db.prepare("insert into users(email, username, password) values(?,?,?);")
    .run("hello@gmail.com", "hello", "1234");
  const { username } = data;

  const userDetails = {
    user_id: 1,
    username: "hello",
    email: "hello@gmail.com",
  };
  const updatedRecord = {
    email: "hello@gmail.com",
    password: "1234",
    username: "karthik",
    user_id: 1,
  };
  describe("testing update user name ", () => {
    it("testing with valid user name", () => {
      updateUsernameOn(db, userDetails, { username });
      const dataInDb = db.prepare("select * from users")
        .all();
      assertEquals(dataInDb[0], updatedRecord);
    });
  });

  it("checking internal server error", async () => {
    const result = updateUsernameOn(undefined, userDetails, { username });
    const response = await result.text();
    assertEquals(response, "Internal server error");
  });

  it("testing create query", () => {
    const body = { username: "karthik", email: "karthik@gmail.com" };
    const [query, values] = createUpdateQuery(
      userDetails,
      body,
      "users",
      "user_id",
    );
    const expectedQuery =
      `UPDATE users SET username = ?, email = ? WHERE user_id = ?`;
    assertEquals(query, expectedQuery);
    assertEquals(values, ["karthik", "karthik@gmail.com", 1]);
  });
});
