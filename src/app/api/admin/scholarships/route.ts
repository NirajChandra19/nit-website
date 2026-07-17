import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT id, student_name, phone_number as student_phone, email as student_email, college, correct_count as correct_answers, total_questions, (correct_count / total_questions * 100) as accuracy, submitted_at as created_at 
       FROM submissions 
       ORDER BY submitted_at DESC`
    );

    return NextResponse.json({ submissions: rows });
  } catch (error) {
    console.error('Fetch Scholarship Results Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
