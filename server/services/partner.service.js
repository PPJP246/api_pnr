import axios from "axios";

import { 
  APP_CONFIG 
} from "../config/env.js";

class PartnerService {

  async sendPatients(patients) {

    if (!Array.isArray(patients)) {
      throw new Error(
        "patients must be array"
      );
    }

    if (patients.length === 0) {
      throw new Error(
        "patients is empty"
      );
    }

    if (patients.length > 500) {
      throw new Error(
        "max 500 records per request"
      );
    }

    const response = await axios.post(
      APP_CONFIG.apiUrl,
      patients,
      {
        headers: {
          "X-API-Key": APP_CONFIG.apiKey,
          "Content-Type":
            "application/json"
        },
        timeout: 15000
      }
    );

    return {
      status: response.status,
      data: response.data
    };
  }
}

export default new PartnerService();