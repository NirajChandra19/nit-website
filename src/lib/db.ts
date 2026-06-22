import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

let pool: mysql.Pool;

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nit_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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
