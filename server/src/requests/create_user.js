export const selectMatchingUser = (DB, email) =>
  DB.prepare("select email from users where email = ?;").all(email);

export const insertNewUserOn = (DB, data) =>
  DB.prepare("insert into users(email,password,username) values(?,?,?);").run(
    ...data,
  );

export const sendSuccess = (msg = "success", status = 200) =>
  new Response(msg, { status });

export const sendFailure = (msg = "Not Found", status = 404) =>
  new Response(msg, { status });

export const createUser = (body, storage) => {
  const { email, password, username } = body;
  const users = selectMatchingUser(storage, email);

  if (users.length >= 1) return sendFailure("Email already exists", 401);

  insertNewUserOn(storage, [email, password, username]);

  return sendSuccess("User created successfully", 201);
};
