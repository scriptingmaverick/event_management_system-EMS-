export const getEventsByUser = (db, lookUpValue) => {
  try {
    const query = `SELECT * FROM events WHERE user_id = ?`;
    const result = db.prepare(query).get(lookUpValue);
    return { success: true, body: result, status: 200 };
  } catch (e) {
    return { success: false, message: e.message, body: {}, status: 401 };
  }
};
