import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const course_id = searchParams.get('course_id');

  try {
    let query = 'SELECT id, course_id, exam_id, question_text, options, correct_answer FROM questions';
    let params: any[] = [];
    
    if (course_id) {
      query = 'SELECT id, course_id, exam_id, question_text, options, correct_answer FROM questions WHERE course_id = ?';
      params = [course_id];
    }
    
    const [rows]: any = await pool.query(query, params);
    
    // Parse options JSON strings back to objects for the client
    const questions = rows.map((r: any) => ({
      ...r,
      options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options
    }));
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Questions GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { course_id, question_text, options, correct_answer } = data;

    if (!course_id || !question_text || !options || !correct_answer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      'INSERT INTO questions (course_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)',
      [course_id, question_text, JSON.stringify(options), correct_answer]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Questions POST error:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, course_id, question_text, options, correct_answer } = data;

    if (!id || !course_id || !question_text || !options || !correct_answer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await pool.query(
      'UPDATE questions SET course_id = ?, question_text = ?, options = ?, correct_answer = ? WHERE id = ?',
      [course_id, question_text, JSON.stringify(options), correct_answer, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Questions PUT error:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing question ID' }, { status: 400 });
    }

    await pool.query('DELETE FROM questions WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Questions DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
