import syncDb from "../config/sync.db.js";

export async function saveHistory(ans) {

  if (!ans.length) return;

  const values = ans.map(an => [
    an,
    new Date()
  ]);

  await db.query(`
      INSERT INTO sync_log
      (
        an,
        sent_at
      )
      VALUES ?
  `, [values]);
}