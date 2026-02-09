export const selectMatchingUser = (DB, email) =>
  DB.prepare("select email from users where email = ?;").all(email);

export const sendSuccess = (msg = "success", status = 200) =>
  new Response(msg, { status });

export const sendFailure = (msg = "Not Found", status = 404) =>
  new Response(msg, { status });
