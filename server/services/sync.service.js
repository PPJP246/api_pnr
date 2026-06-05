import partnerService from "./partner.service.js";

import {
  getPatients
} from "../repositories/patient.repository.js";

import {
  getExistingAns
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

  const summary = {
    totalRecords: 0,
    alreadySynced: 0,
    pendingToSend: 0,
    partnerSuccess: 0,
    partnerFailed: 0,
    savedToSyncLog: 0
  };

  console.log(
    "\n========== START POLLING =========="
  );

  console.log(
    `Started At: ${formatDateTime()}`
  );

  try {

    const rows =
      await getPatients();

    summary.totalRecords =
      rows.length;

    if (!rows.length) {

      console.log(
        "No data found"
      );

      return;
    }

    const syncedSet =
      await getExistingAns();

    const filteredRows =
      rows.filter(
        row => !syncedSet.has(row.an)
      );

    summary.alreadySynced =
      rows.length -
      filteredRows.length;

    summary.pendingToSend =
      filteredRows.length;

    if (!filteredRows.length) {

      console.log(
        `All already synced (${rows.length})`
      );

      return;
    }

    const payload =
      buildPayload(
        filteredRows,
        APP_CONFIG.location
      );

    const ans =
      extractAns(
        filteredRows
      );

    console.log(
      `Sending ${payload.length} records`
    );

    const result =
      await partnerService.sendPatients(
        payload
      );

    const partnerSummary =
      await handlePartnerResponse(
        result,
        ans
      );

    summary.partnerSuccess =
      partnerSummary.partnerSuccess;

    summary.partnerFailed =
      partnerSummary.partnerFailed;

    summary.savedToSyncLog =
      partnerSummary.savedToSyncLog;

  } catch (err) {

    console.log(
      "========== POLLING ERROR =========="
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

    console.log(
      "\n========== POLLING SUMMARY =========="
    );

    console.log(
      `Total Records    : ${summary.totalRecords}`
    );

    console.log(
      `Already Synced   : ${summary.alreadySynced}`
    );

    console.log(
      `Pending To Send  : ${summary.pendingToSend}`
    );

    console.log(
      `Partner Success  : ${summary.partnerSuccess}`
    );

    console.log(
      `Partner Failed   : ${summary.partnerFailed}`
    );

    console.log(
      `Saved To SyncLog : ${summary.savedToSyncLog}`
    );

    console.log(
      `Finished At      : ${formatDateTime()}`
    );

    console.log(
      "========== END POLLING ==========\n"
    );

  }

}