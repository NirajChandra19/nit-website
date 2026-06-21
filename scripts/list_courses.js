import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nit_db',
});

async function run() {
  const [courses] = await pool.query("SELECT id, title FROM courses WHERE type = 'course'");
  console.log(JSON.stringify(courses, null, 2));
  process.exit(0);
}
run();
