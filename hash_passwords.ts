import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import pool from './src/lib/db';
import bcrypt from 'bcrypt';

async function migratePasswords() {
  console.log('Starting password migration...');
  
  try {
    // 1. Migrate Students
    const [students]: any = await pool.query('SELECT id, password FROM students');
    let studentCount = 0;
    
    for (const student of students) {
      if (student.password && !student.password.startsWith('$2')) {
        const hashed = await bcrypt.hash(student.password, 10);
        await pool.query('UPDATE students SET password = ? WHERE id = ?', [hashed, student.id]);
        studentCount++;
      }
    }
    console.log(`Migrated ${studentCount} plain-text student passwords.`);

    // 2. Migrate Admins
    const [admins]: any = await pool.query('SELECT id, password FROM admins');
    let adminCount = 0;
    
    for (const admin of admins) {
      if (admin.password && !admin.password.startsWith('$2')) {
        const hashed = await bcrypt.hash(admin.password, 10);
        await pool.query('UPDATE admins SET password = ? WHERE id = ?', [hashed, admin.id]);
        adminCount++;
      }
    }
    console.log(`Migrated ${adminCount} plain-text admin passwords.`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection.');
    process.exit(0);
  }
}

migratePasswords();
