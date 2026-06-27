import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nit_db',
});

async function run() {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    console.log(tables);

    for (let tableObj of tables) {
      let tableName = Object.values(tableObj)[0];
      const [columns] = await pool.query(`DESCRIBE ${tableName}`);
      console.log(`\nTable: ${tableName}`);
      console.log(columns.map(c => `${c.Field} (${c.Type})`).join(', '));
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
