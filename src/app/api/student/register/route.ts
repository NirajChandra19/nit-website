import { NextResponse } from 'next/server';
import pool, { generateRegistrationId } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !body.name || !body.email || !body.password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Sanitize inputs
    const name = String(body.name).trim();
    const email = String(body.email).trim().toLowerCase();
    const password = String(body.password);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if email exists
    const [existing]: any = await pool.query('SELECT id FROM students WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const reg_id = generateRegistrationId();
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await pool.query(
      'INSERT INTO students (reg_id, name, email, password) VALUES (?, ?, ?, ?)',
      [reg_id, name, email, hashedPassword]
    );

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: result.insertId,
        name,
        email,
        reg_id
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
