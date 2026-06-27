import mysql from 'mysql2/promise';

async function upgrade() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'niraj19',
    database: 'nit_db',
  });

  try {

    console.log('Adding last_notification_read_at to students...');
    await pool.query(`
      ALTER TABLE students 
      ADD COLUMN last_notification_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('Added successfully.');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('Column last_notification_read_at already exists.');
    } else {
      console.error(e);
    }
  }

  try {
    console.log('Creating notifications table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('certificate', 'course') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);
    console.log('Created successfully.');
  } catch (e) {
    console.error(e);
  }

  process.exit(0);
}

upgrade();
