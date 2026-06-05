import {
  saveHistory
} from "../repositories/sync.repository.js";

import {
  extractFailedAns
} from "../utils/partner.util.js";

export async function handlePartnerResponse(
  result,
  ans
) {

  const summary = {
    partnerSuccess: 0,
    partnerFailed: 0,
    savedToSyncLog: 0
  };

  switch (result.status) {

    case 201: {

      await saveHistory(ans);

      summary.partnerSuccess =
        ans.length;

      summary.savedToSyncLog =
        ans.length;

      console.log(
        `Saved ${ans.length} records`
      );

      return summary;
    }

    case 207: {

      const failedAns =
        extractFailedAns(
          result.data[
            "รายละเอียดข้อผิดพลาด"
          ] || []
        );

      const successAns =
        ans.filter(
          an =>
            !failedAns.includes(an)
        );

      await saveHistory(
        successAns
      );

      summary.partnerSuccess =
        successAns.length;

      summary.partnerFailed =
        failedAns.length;

      summary.savedToSyncLog =
        successAns.length;

      console.log(
        `Saved ${successAns.length} records`
      );

      console.log(
        `Failed ${failedAns.length} records`
      );

      return summary;
    }

    case 400:

      summary.partnerFailed =
        ans.length;

      console.error(
        "Validation Error"
      );

      console.error(
        JSON.stringify(
          result.data,
          null,
          2
        )
      );

      return summary;

    case 401:
    case 403:

      summary.partnerFailed =
        ans.length;

      console.error(
        "Authorization Error"
      );

      console.error(
        JSON.stringify(
          result.data,
          null,
          2
        )
      );

      return summary;

    case 500:

      summary.partnerFailed =
        ans.length;

      console.error(
        "Partner Internal Error"
      );

      console.error(
        JSON.stringify(
          result.data,
          null,
          2
        )
      );

      return summary;

    default:

      console.warn(
        `Unhandled Status : ${result.status}`
      );

      return summary;

  }

}