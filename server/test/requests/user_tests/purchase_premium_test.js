import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { DatabaseSync } from "node:sqlite";
import { changeUserStatus } from "../../../src/requests/user/purchase_premium.js";

describe("purchase premium", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    is_premium_user INTEGER NOT NULL DEFAULT 0 CHECK (is_premium_user IN (0,1)),
    created_at DEFAULT (DATETIME('now','localtime'))
    );`);
  const userData = { user_id: 1 };
  db.prepare(`insert into users(username, password, email) values(?,?,?)`)
    .run("karthik", "12", "ka@gmail.com");

  describe("purchase premium", () => {
    it("1. should change the value 0 to 1", () => {
      const response = changeUserStatus(db, userData);
      assertEquals(response.status, 200);
    });
    it("2. with invalid data", () => {
      const response = changeUserStatus(db);
      assertEquals(response.status, 501);
    });
    it("3. without db", () => {
      const response = changeUserStatus();
      assertEquals(response.status, 501);
    });
  });
});
