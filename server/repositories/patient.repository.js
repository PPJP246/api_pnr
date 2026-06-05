import db from "../config/db.js";

export async function getPatients() {

  const [rows] = await db.query(`
      SELECT 
        p.hn,
        p.cid,
        p.an,
        DATE_FORMAT(p.reg_date, '%Y-%m-%d') AS reg_date,
        p.full_name,
        p.age_years
      FROM patient_sync p
      LEFT JOIN sync_log s
      ON p.an = s.an
      WHERE s.an IS NULL
      LIMIT 500
  `);

  return rows;
}