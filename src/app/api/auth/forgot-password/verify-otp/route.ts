import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [rows]: any = await pool.query(
      'SELECT reset_otp, reset_otp_expiry FROM students WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No account found.' }, { status: 400 });
    }

    const student = rows[0];

    if (!student.reset_otp || student.reset_otp !== code) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    if (new Date() > new Date(student.reset_otp_expiry)) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'OTP verified successfully.' });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
