import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nit_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

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
