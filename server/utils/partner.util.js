export function buildPayload(
  rows,
  location
) {

  return rows.map(row => ({
    hn: row.hn,
    cid: row.cid,
    an: row.an,
    reg_date: row.reg_date,
    full_name: row.full_name,
    location,
    age_years: row.age_years
  }));

}

export function extractAns(
  rows
) {

  return rows.map(
    row => row.an
  );

}

export function extractFailedAns(
  failedDetails = []
) {

  return failedDetails.map(
    item =>
      item["ข้อมูล"]
        .replace("AN:", "")
        .trim()
  );

}