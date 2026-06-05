import syncDb from "../config/sync.db.js";

export async function getSyncedAnSet() {

  const [rows] = await syncDb.query(`
    SELECT an
    FROM sync_log
  `);

  return new Set(rows.map(r => r.an));

}