import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    await pool.query(
      'UPDATE students SET password = ?, reset_otp = NULL, reset_otp_expiry = NULL WHERE email = ?',
      [hashedPassword, email]
    );

    return NextResponse.json({ success: true, message: 'Password reset successfully.' });

  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
