import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'nit_secret_key_2026';

async function getStudentId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('nit_token')?.value;
  if (!token) return null;
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    return payload.studentId;
  } catch (error) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(email, 'NIT Website', secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    return NextResponse.json({ success: true, secret, qrCodeUrl });
  } catch (error) {
    console.error('2FA generate error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { token, secret } = await req.json();

    if (!token || !secret) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const isValid = authenticator.verify({ token, secret });

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid 2FA token' }, { status: 401 });
    }

    await pool.query('UPDATE students SET two_factor_secret = ?, is_2fa_enabled = TRUE WHERE id = ?', [secret, studentId]);

    return NextResponse.json({ success: true, message: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA enable error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await pool.query('UPDATE students SET two_factor_secret = NULL, is_2fa_enabled = FALSE WHERE id = ?', [studentId]);

    return NextResponse.json({ success: true, message: '2FA disabled successfully' });
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
