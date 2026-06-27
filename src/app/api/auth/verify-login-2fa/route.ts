import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticator } from 'otplib';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'nit_secret_key_2026';

export async function POST(request: Request) {
  try {
    const { studentId, code } = await request.json();

    if (!studentId || !code) {
      return NextResponse.json({ success: false, error: 'Student ID and code are required' }, { status: 400 });
    }

    const [rows]: any = await pool.query(
      'SELECT id, name, email, reg_id, two_factor_secret FROM students WHERE id = ?',
      [studentId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const student = rows[0];

    const isValid = authenticator.verify({ token: code, secret: student.two_factor_secret });

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid 2FA code' }, { status: 401 });
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ studentId: student.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

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
    console.error('Verify 2FA Login Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

