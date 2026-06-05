import patientService from "./services/partner.service.js";
import { getPendingPatients } from './repositories/patient.repository.js';

const patients = await getPendingPatients();

console.log(
  JSON.stringify(
    patients,
    null,
    2
  )
);

try {

  const result = await patientService.sendPatients(
    patients
  );

  console.log(result);

} catch (err) {

  console.error(
    JSON.stringify(
      err.response?.data,
      null,
      2
    )
  );

}