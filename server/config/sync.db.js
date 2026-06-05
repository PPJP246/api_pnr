import mysql from "mysql2/promise";

const syncDb = mysql.createPool({
  host: process.env.SYNC_DB_HOST,
  port: process.env.SYNC_DB_PORT,
  user: process.env.SYNC_DB_USER,
  password: process.env.SYNC_DB_PASSWORD,
  database: process.env.SYNC_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

export default syncDb;