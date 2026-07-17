const mysql = require('mysql2/promise');

async function check() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'niraj19',
    database: 'nit_db'
  });
  
  const [tables] = await conn.query("SHOW TABLES");
  console.log("TABLES:", tables);
  
  try {
    const [exams] = await conn.query("DESCRIBE exams");
    console.log("EXAMS:", exams);
  } catch (e) { console.log("EXAMS table not found or error:", e.message); }
  
  try {
    const [questions] = await conn.query("DESCRIBE questions");
    console.log("QUESTIONS:", questions);
  } catch (e) { console.log("QUESTIONS table not found or error:", e.message); }
  
  try {
    const [submissions] = await conn.query("DESCRIBE submissions");
    console.log("SUBMISSIONS:", submissions);
  } catch (e) { console.log("SUBMISSIONS table not found or error:", e.message); }
  
  conn.end();
}
check();
