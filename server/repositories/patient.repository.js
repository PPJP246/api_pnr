import hisDb from "../config/hisdb.js";

export async function getPatients() {

  const [rows] = await hisDb.query(`
    SELECT
        an.hn,
        p.cid,

        an.an,

        DATE_FORMAT(
            an.regdate,
            '%Y-%m-%d'
        ) AS reg_date,

        an.dchdate,

        CONCAT(
            p.pname,
            p.fname,
            ' ',
            p.lname
        ) AS full_name,

        TIMESTAMPDIFF(
            YEAR,
            STR_TO_DATE(
                p.birthday,
                '%d/%m/%Y'
            ),
            CURDATE()
        ) AS age_years,

        r.hospcode

    FROM referout r

    LEFT JOIN an_stat an
        ON an.an = r.vn

    LEFT JOIN patient p
        ON p.hn = r.hn

    LEFT JOIN test_api_post.sync_log s
        ON s.an = an.an

    WHERE an.ward = '04'
      AND r.hospcode = '10690'
      AND an.dchdate IS NOT NULL
      AND s.an IS NULL

    LIMIT 1
  `);

  return rows;

}