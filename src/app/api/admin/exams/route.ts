import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, duration_minutes FROM exams ORDER BY id DESC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, duration_minutes } = await request.json();
    if (!title || !duration_minutes) {
      return NextResponse.json({ error: 'Title and duration are required' }, { status: 400 });
    }

    const examId = crypto.randomUUID();
    await pool.query<any>(
      'INSERT INTO exams (id, title, duration_minutes) VALUES (?, ?, ?)',
      [examId, title, duration_minutes]
    );

    return NextResponse.json({ success: true, id: examId });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
