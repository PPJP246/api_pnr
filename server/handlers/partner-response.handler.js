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

  switch (result.status) {

    case 201:

      await saveHistory(ans);

      console.log(
        `Saved ${ans.length} records`
      );

      break;

    case 207: {

      const failedAns =
        extractFailedAns(
          result.data["รายละเอียดข้อผิดพลาด"]
        );

      const successAns =
        ans.filter(
          an =>
            !failedAns.includes(an)
        );

      await saveHistory(
        successAns
      );

      console.log(
        `Saved ${successAns.length} records`
      );

      console.log(
        `Failed ${failedAns.length} records`
      );

      break;
    }

    case 400:

      console.error(
        "Validation Error"
      );

      console.error(
        result.data
      );

      break;

    case 401:
    case 403:

      console.error(
        "Authorization Error"
      );

      console.error(
        result.data
      );

      break;

    case 500:

      console.error(
        "Partner Internal Error"
      );

      console.error(
        result.data
      );

      break;

    default:

      console.warn(
        `Unhandled Status: ${result.status}`
      );

  }

}