import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'nit_secret_key_2026';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('nit_token')?.value;

  // FIX 1: If no token is found, return a successful 200 response with a null user.
  // This tells the frontend "You are a guest" without throwing a red console error.
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const studentId = payload.studentId;

    const [rows]: any = await pool.query(
      'SELECT id, name, email, reg_id FROM students WHERE id = ?',
      [studentId]
    );

    // FIX 2: If the token is valid but the user was deleted from the DB
    if (rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: rows[0] }, { status: 200 });
  } catch (error) {
    // FIX 3: If the token is expired or invalid, just return a null user.
    return NextResponse.json({ user: null }, { status: 200 });
  }
}