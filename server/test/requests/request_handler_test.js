import { describe, it } from "@std/testing";
import { assertEquals, assertRejects } from "@std/assert";
import { parse } from "../../src/requests/request_handler.js";

describe("testing parser", () => {
  it("testing with invalid request", () => {
    assertRejects(async () => await parse("hello"));
  });
  describe("testing with GET method", () => {
    it("testing with valid request", async () => {
      const request = new Request("http://localhost:8080");
      const result = await parse(request);
      assertEquals(result.method, "GET");
      assertEquals(result.body, {'/':""});
      assertEquals(result.baseUrl, "http://localhost:8080");
      assertEquals(result.path, "/");
    });
  });

  describe("testing with POST method", () => {
    it("testing with JSON Data", async () => {
      const request = new Request("http://localhost:8080/create", {
        method: "POST",
        body: JSON.stringify({ name: "hi" }),
        headers: {
          "content-type": "application/json",
        },
      });

      const result = await parse(request);
      assertEquals(result.method, "POST");
      assertEquals(result.body, { name: "hi" });
      assertEquals(result.baseUrl, "http://localhost:8080");
      assertEquals(result.path, "/create");
    });

    it("testing with TEXT Data", async () => {
      const request = new Request("http://localhost:8080/create", {
        method: "POST",
        body: "hello",
      });

      const result = await parse(request);
      assertEquals(result.method, "POST");
      assertEquals(result.body, "hello");
      assertEquals(result.baseUrl, "http://localhost:8080");
      assertEquals(result.path, "/create");
    });
  });
});
