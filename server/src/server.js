import { requestHandler } from "./requests/request_handler.js";

export const establishServer = (port) => {
  Deno.serve({ port }, requestHandler);
};
