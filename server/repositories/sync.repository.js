import syncDb from "../config/sync.db.js";

export async function saveHistory(ans) {

  if (!Array.isArray(ans) || ans.length === 0) {
    console.log("No AN to save");
    return;
  }

  const values = ans.map(an => [
    an,
    new Date()
  ]);

  console.log("Inserting to sync_log:", values);
  console.log("ANS:", ans);
  console.log("SUCCESS ANS:", successAns);
  console.log("VALUES:", values);

  await syncDb.query(`
    INSERT INTO sync_log
    (
      an,
      sent_at
    )
    VALUES ?
  `, [values]);

}