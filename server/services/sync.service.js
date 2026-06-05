import partnerService from "./partner.service.js";

import {
  getPatients
} from "../repositories/patient.repository.js";

import {
  getExistingAns,
  saveHistory
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

  console.log("========== START POLLING ==========");

  console.log(
      `Started At: ${formatDateTime()}`
  )

  try {

    // 1. ดึง HIS
    const rows = await getPatients();

    if (!rows.length) {
      console.log("No data");
      return;
    }

    // 2. ดึงที่เคยส่งแล้ว
    const syncedSet = await getExistingAns();

    // 3. filter กันซ้ำ
    const filteredRows = rows.filter(
      r => !syncedSet.has(r.an)
    );

    const alreadySyncedCount = rows.length - filteredRows.length;

    if (!filteredRows.length) {
      console.log(
        `All already synced (${rows.length} records)`
      );
      return;
    }

    console.log(
      `Found ${filteredRows.length} new records`
    );

    console.log(
      `Already synced: ${alreadySyncedCount}`
    );

    // 4. build payload
    const payload = buildPayload(
      filteredRows,
      APP_CONFIG.location
    );

    const ans = extractAns(filteredRows);

    console.log(`Sending ${payload.length} records`);

    // 5. ส่ง API
    const result = await partnerService.sendPatients(payload);

    // 6. handle response
    await handlePartnerResponse(result, ans);

  } catch (err) {

    console.log(
      "==========POOLING ERROR=========="
    )

    console.error(
      JSON.stringify(
        err.response?.data ??
        err.message,
        null,
        2
      )
    );

  } finally {

    console.log(
      `Finished At: ${formatDateTime()}`
    )
  
    console.log("========== END POLLING ==========");
  }

}