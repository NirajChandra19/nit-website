import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const username = 'prashant';
    const plainPassword = 'Prashant@nit123';

    // 1. Securely hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 2. Delete any broken versions of this user from the database
    await pool.query('DELETE FROM admins WHERE username = ?', [username]);

    // 3. Insert the fresh, perfectly hashed user
    await pool.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    return NextResponse.json({ 
      success: true, 
      message: `Admin user '${username}' created successfully!`,
      note: "PLEASE DELETE THIS FILE NOW FOR SECURITY."
    });

  } catch (error) {
    console.error('Setup Error:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}