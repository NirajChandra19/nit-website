import mysql from 'mysql2/promise';
import crypto from 'crypto';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nit_db',
});

async function run() {
  try {
    try {
      await pool.query('ALTER TABLE certificates ADD COLUMN public_verification_token VARCHAR(36) UNIQUE');
      console.log('Column public_verification_token added');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('Column already exists');
      } else {
        throw e;
      }
    }

    const [rows] = await pool.query('SELECT id FROM certificates WHERE public_verification_token IS NULL');
    for (let row of rows) {
      const token = crypto.randomUUID();
      await pool.query('UPDATE certificates SET public_verification_token = ? WHERE id = ?', [token, row.id]);
    }
    console.log(`Updated ${rows.length} rows`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
