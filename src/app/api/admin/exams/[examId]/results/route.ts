import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    const [countResult, rowsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM submissions WHERE exam_id = ?', [examId]),
      pool.query(
        `SELECT id, student_name, phone_number as student_phone, college, correct_count as correct_answers, total_questions, (correct_count / total_questions * 100) as accuracy 
         FROM submissions 
         WHERE exam_id = ? 
         ORDER BY correct_count DESC, accuracy DESC
         LIMIT ${limit} OFFSET ${offset}`,
        [examId]
      )
    ]);

    const total = (countResult[0] as any)[0].total;
    const results = rowsResult[0];

    return NextResponse.json({
      data: results,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
