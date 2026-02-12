export const selectMatchingUser = (db, email) =>
  db.prepare("select * from users where email = ?;").all(email);

export const saveToFile = (userData) => {
  Deno.writeTextFileSync("./user.json", JSON.stringify(userData));
};

export const createResponse = (body, status = 200) => {
  const headers = {
    "content-type": "application/json",
  };

  return new Response(JSON.stringify(body), { status, headers });
};

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
