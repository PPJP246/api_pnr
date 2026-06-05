export async function getPatients() {

  const [rows] = await hisDb.query(`
    SELECT
        an.hn,
        p.cid,
        an.an,
        DATE_FORMAT(an.regdate, '%Y-%m-%d') AS reg_date,
        CONCAT(p.pname, p.fname, ' ', p.lname) AS full_name,
        TIMESTAMPDIFF(
            YEAR,
            STR_TO_DATE(p.birthday, '%d/%m/%Y'),
            CURDATE()
        ) AS age_years
    FROM referout r
    LEFT JOIN an_stat an ON an.an = r.vn
    LEFT JOIN patient p ON p.hn = r.hn
    WHERE an.ward = '04'
      AND r.hospcode = '10690'
      AND an.dchdate IS NOT NULL
    LIMIT 1
  `);

  return rows;
}