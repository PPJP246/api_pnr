import partnerService from "./partner.service.js";

import {
  getPatients
} from "../repositories/patient.repository.js";

import {
  getSyncedAnSet
} from "../repositories/sync.repository.js";

import { 
  buildPayload,
  extractAns 
} from "../utils/partner.util.js"; 

import {
  handlePartnerResponse
} from "../handlers/partner-response.handler.js";

import {
  APP_CONFIG
} from "../config/env.js";

import {
  formatDateTime
} from "../utils/date.util.js";

export async function syncPatients() {

  const startTime = Date.now();

  console.log("===========START POLLING===========");
  console.log(
    `Started At: ${formatDateTime()}`
  );
  console.log("================================");

  try {

    const rows = await getPatients();

    const syncedSet = await getSyncedAnSet();

    const filteredRows = rows.filter(
      r => !syncedSet.has(r.an)
    );

    if (!filteredRows.length) {
      console.log("All records already synced");
      return;
    }

    const payload = buildPayload(
      filteredRows,
      APP_CONFIG.location
    );

    const ans = extractAns(filteredRows);

    console.log(
      `Found ${payload.length} pending records`
    );

    const result =
      await partnerService.sendPatients(
        payload
      );

    await handlePartnerResponse(
      result,
      ans
    );

    console.log(
      JSON.stringify(
        result.data,
        null,
        2
      )
    );

  } catch (err) {

    console.error(
      "POLLING ERROR"
    );

    console.error(
      JSON.stringify(
        err.response?.data ??
        err.message,
        null,
        2
      )
    );

  } finally {

    const duration =
      ((Date.now() - startTime) / 1000)
        .toFixed(2);

    console.log("===========END POLLING===========");
    console.log(
      `Duration: ${duration} seconds`
    );
    console.log(
      `Finished At: ${formatDateTime()}`
    );
    console.log("================================\n");

  }

}