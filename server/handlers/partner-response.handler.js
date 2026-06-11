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
    savedToSyncLog: 0,
    errors: []
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

      break;
    }

    case 207: {

      const failedDetails =
        result.data[
          "รายละเอียดข้อผิดพลาด"
        ] || [];

      const failedAns =
        extractFailedAns(
          failedDetails
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

      summary.errors =
        failedDetails;

      console.log(
        `Saved ${successAns.length} records`
      );

      console.log(
        `Failed ${failedAns.length} records`
      );

      break;
    }

    case 400: {

      const failedDetails =
        result.data[
          "รายละเอียดข้อผิดพลาด"
        ] || [];

      summary.partnerFailed =
        ans.length;

      summary.errors =
        failedDetails;

      break;
    }

    case 401:
    case 403: {

      summary.partnerFailed =
        ans.length;

      summary.errors = [
        {
          ข้อมูล: "Authorization",
          รายละเอียด: [
            "API Key Invalid"
          ]
        }
      ];

      break;
    }

    case 500: {

      summary.partnerFailed =
        ans.length;

      summary.errors = [
        {
          ข้อมูล: "Partner Server",
          รายละเอียด: [
            "Internal Server Error"
          ]
        }
      ];

      break;
    }

  }

  return summary;

}