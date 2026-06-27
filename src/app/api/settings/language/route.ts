import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'nit_secret_key_2026';

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('nit_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let studentId;
    try {
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secretKey);
      studentId = payload.studentId;
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { language } = await req.json();

    if (!language) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await pool.query('UPDATE students SET language = ? WHERE id = ?', [language, studentId]);

    return NextResponse.json({ success: true, message: 'Language updated successfully' });
  } catch (error) {
    console.error('Language update error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
