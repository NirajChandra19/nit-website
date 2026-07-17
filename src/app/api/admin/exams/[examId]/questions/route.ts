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
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const offset = (page - 1) * limit;

    const [countResult, rowsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM questions WHERE exam_id = ?', [examId]),
      pool.query(`SELECT * FROM questions WHERE exam_id = ? ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`, [examId])
    ]);

    const total = (countResult[0] as any)[0].total;
    const questions = rowsResult[0];

    return NextResponse.json({
      data: questions,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params;
    const body = await request.json();
    const { question_text, options, correct_answer } = body;

    if (!question_text || !options || !correct_answer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO questions (exam_id, course_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
      [examId, 1, question_text, JSON.stringify(options), correct_answer]
    );

    return NextResponse.json({ success: true, message: 'Question added successfully' });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
