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

  const startTime = Date.now();

  const summary = {
    totalRecords: 0,
    alreadySynced: 0,
    pendingToSend: 0,
    partnerSuccess: 0,
    partnerFailed: 0,
    savedToSyncLog: 0,
    errors: []
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

    summary.errors =
      partnerSummary.errors;

  } catch (err) {

    console.log(
      "========== POLLING ERROR =========="
    );

    const errorData =
      err.response?.data;

    console.error(
      JSON.stringify(
        errorData ??
        err.message,
        null,
        2
      )
    );

    if (errorData?.summary) {

      summary.partnerSuccess =
        errorData.summary[
          "บันทึกได้สำเร็จ"
        ] || 0;

      summary.partnerFailed =
        errorData.summary[
          "ผิดพลาด"
        ] || 0;

      summary.errors =
        errorData[
          "รายละเอียดข้อผิดพลาด"
        ] || [];

    }

  } finally {

    const duration =
      (
        (Date.now() - startTime)
        / 1000
      ).toFixed(2);

    console.log(
      "\n========== POLLING SUMMARY =========="
    );

    console.log(
      `Duration         : ${duration}s`
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

    if (summary.errors.length > 0) {

      console.log(
        "\n========== PARTNER ERRORS =========="
      );

      for (const item of summary.errors) {

        console.log(
          item["ข้อมูล"]
        );

        for (
          const message of item["รายละเอียด"]
        ) {

          console.log(
            `  - ${message}`
          );

        }

      }

    }

    console.log(
      `Finished At      : ${formatDateTime()}`
    );

    console.log(
      "========== END POLLING ==========\n"
    );

  }

}