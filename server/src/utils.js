export const selectMatchingUser = (DB, email) =>
  DB.prepare("select email from users where email = ?;").all(email);

export const sendSuccess = (msg = "success", status = 200) =>
  new Response(msg, { status });

export const sendFailure = (msg = "Not Found", status = 404) =>
  new Response(msg, { status });

export const createUpdateQuery = (
  criteria,
  updateFields,
  tableName,
  lookUpKey,
) => {
  const query = [];
  const values = [];

  query.push(`UPDATE ${tableName} SET`);

  for (const [column, value] of Object.entries(updateFields)) {
    query.push(`${column} = ?,`);
    values.push(value);
  }

  query.push(query.pop().slice(0, -1));
  query.push(`WHERE ${lookUpKey} = ?`);
  values.push(criteria[lookUpKey]);

  return [query.join(" "), values];
};
