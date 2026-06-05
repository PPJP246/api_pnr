import mysql from "mysql2/promise";

const hisDb = mysql.createPool({
  host: process.env.HIS_DB_HOST,
  port: process.env.HIS_DB_PORT,
  user: process.env.HIS_DB_USER,
  password: process.env.HIS_DB_PASSWORD,
  database: process.env.HIS_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

export default hisDb;