import dotenv from "dotenv";
import path from "path";
import mysql from "mysql2/promise";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

console.log("DB ENV:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

let pool: mysql.Pool;

const poolConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nit_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};

if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool(poolConfig);
} else {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool(poolConfig);
  }
  pool = global.mysqlPool;
}

export default pool;

/**
 * Helper to generate a unique Registration ID: NIT-YYYY-XXXX
 */
export const generateRegistrationId = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
  return `NIT-${year}-${randomNum}`;
};

/**
 * Helper to generate a unique Certificate ID: CERT-NIT-XXXX-YYYY
 */
export const generateCertificateId = (): string => {
  const timestamp = Date.now().toString().slice(-4);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CERT-NIT-${timestamp}-${randomNum}`;
};
