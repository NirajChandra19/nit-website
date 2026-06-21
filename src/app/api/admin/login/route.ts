import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !body.username || !body.password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    // Sanitize inputs
    const username = String(body.username).trim();
    const password = String(body.password);

    const [rows]: any = await pool.query(
      'SELECT id, username, password FROM admins WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const admin = rows[0];

    let isPasswordValid = false;
    if (admin.password && admin.password.startsWith('$2')) {
      isPasswordValid = await bcrypt.compare(password, admin.password);
    } else {
      isPasswordValid = admin.password === password;
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: admin.id, username: admin.username } 
    });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
