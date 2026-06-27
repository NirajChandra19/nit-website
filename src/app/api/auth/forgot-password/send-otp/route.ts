import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if the email exists in the students table
    const [users]: any = await pool.query('SELECT id, name FROM students WHERE email = ?', [email]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update students table
    await pool.query(
      'UPDATE students SET reset_otp = ?, reset_otp_expiry = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE email = ?',
      [otp, email]
    );

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let mailOptions = {
      from: `"NIT Student Portal" <${process.env.SMTP_USER || 'no-reply@nit.edu'}>`,
      to: email,
      subject: 'Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">NIT Student Portal</h2>
          <p style="font-size: 16px; color: #333;">Hello ${users[0].name},</p>
          <p style="font-size: 16px; color: #333;">Your verification code to reset your password is:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #666;">This code is valid for 10 minutes. Please do not share this code with anyone.</p>
        </div>
      `,
    };

    if (!process.env.SMTP_USER) {
      console.log('====================================');
      console.log(`DEVELOPMENT MODE: OTP for ${email} is: ${otp}`);
      console.log('====================================');
    } else {
      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
