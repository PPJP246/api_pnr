import cron from "node-cron";

import {
  syncPatients
} from "../services/sync.service.js";

cron.schedule("* * * * *", async () => {

    try {

      await syncPatients();

    } catch (error) {

      console.error(error);

    }
  }
);