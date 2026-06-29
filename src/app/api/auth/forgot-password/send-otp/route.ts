import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Check if the email exists
    const [users]: any = await pool.query('SELECT id, name FROM students WHERE email = ?', [email]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    // 2. Anti-Spam: Check if a request was made in the last 2 minutes
    const [existing]: any = await pool.query(
      'SELECT id FROM students WHERE email = ? AND reset_otp_expiry > DATE_ADD(NOW(), INTERVAL 8 MINUTE)',
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Please wait before requesting again' }, { status: 429 });
    }

    // 3. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 4. Update Database
    await pool.query(
      'UPDATE students SET reset_otp = ?, reset_otp_expiry = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE email = ?',
      [otp, email]
    );

    // 5. Send Email
    await sendEmail(
      email,
      'Password Reset Code',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">NIT Student Portal</h2>
          <p>Hello ${users[0].name},</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a;">${otp}</span>
          </div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    );

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}