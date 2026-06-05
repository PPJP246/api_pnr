import syncDb from '../config/sync.db.js'

// ดึงรายการที่เคยส่งแล้ว
export async function getExistingAns() {

  const [rows] = await syncDb.query(`
    SELECT an
    FROM sync_log
  `);

  return new Set(rows.map(r => r.an));
}

// บันทึก log
export async function saveHistory(ans) {

  if (!Array.isArray(ans) || ans.length === 0) return;

  const values = ans.map(an => [
    an,
    new Date()
  ]);

  await syncDb.query(`
    INSERT IGNORE INTO sync_log (an, sent_at)
    VALUES ?
  `, [values]);
}