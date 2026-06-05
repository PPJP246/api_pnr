import db from "../config/db.js";

export async function saveHistory(ans) {

  if (!ans.length) return;

  const values = ans.map(an => [
    an,
    "SUCCESS",
    new Date()
  ]);

  await db.query(`
      INSERT INTO sync_log
      (
        an,
        response_status,
        sent_at
      )
      VALUES ?
  `, [values]);
}