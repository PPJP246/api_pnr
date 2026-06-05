import cron from "node-cron";

import {
  syncPatients
} from "../services/sync.service.js";

  cron.schedule("*/10 * * * *", async () => {

    try {

      await syncPatients();

    } catch (error) {

      console.error(error);

    }
  }
);