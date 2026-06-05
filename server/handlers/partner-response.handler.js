import { saveHistory } from "../repositories/sync.repository.js";
import { extractFailedAns } from "../utils/partner.util.js";

export async function  handlePartnerResponse(result, ans) {

  // success ทั้งหมด
  if (result.status === 201) {
    await saveHistory(ans);
    console.log(`Saved ${ans.length}`);
    return;
  }

  // partial success
  if (result.status === 207) {

    const failed = extractFailedAns(
      result.data["รายละเอียดข้อผิดพลาด"] || []
    );

    const success = ans.filter(
      a => !failed.includes(a)
    );

    await saveHistory(success);

    console.log(`Saved ${success.length}`);
    console.log(`Failed ${failed.length}`);

    return;
  }

  console.log("Skip save:", result.status, result.data);
}