import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'nit_secret_key_2026';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !body.email || !body.password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Sanitize inputs
    const email = String(body.email).trim().toLowerCase();
    const password = String(body.password);

    const [rows]: any = await pool.query(
      'SELECT id, name, email, reg_id, password, is_2fa_enabled FROM students WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const student = rows[0];

    // Verify the password. Handle both bcrypt and legacy plain text passwords gracefully.
    let isPasswordValid = false;
    if (student.password.startsWith('$2')) {
      isPasswordValid = await bcrypt.compare(password, student.password);
    } else {
      isPasswordValid = student.password === password;
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if 2FA is enabled
    if (student.is_2fa_enabled) {
      return NextResponse.json({
        success: true,
        requires2FA: true,
        studentId: student.id
      });
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ studentId: student.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    // Normal login flow
    const response = NextResponse.json({
      success: true,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        reg_id: student.reg_id
      }
    });

    response.cookies.set('nit_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Student Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

