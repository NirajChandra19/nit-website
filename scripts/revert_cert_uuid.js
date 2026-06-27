import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nit_db',
});

async function run() {
  try {
    await pool.query('ALTER TABLE certificates DROP COLUMN public_verification_token');
    console.log('Column public_verification_token dropped successfully');
    process.exit(0);
  } catch (e) {
    if (e.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
      console.log('Column does not exist, nothing to drop');
      process.exit(0);
    } else {
      console.error(e);
      process.exit(1);
    }
  }
}
run();
