import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, duration_minutes FROM exams WHERE is_active = 1'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching active exams:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
