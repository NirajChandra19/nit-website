import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ examId: string; questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const body = await request.json();
    const { question_text, options, correct_answer } = body;

    if (!question_text || !options || !correct_answer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await pool.query(
      'UPDATE questions SET question_text = ?, options = ?, correct_answer = ? WHERE id = ?',
      [question_text, JSON.stringify(options), correct_answer, questionId]
    );

    return NextResponse.json({ success: true, message: 'Question updated successfully' });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ examId: string; questionId: string }> }
) {
  try {
    const { questionId } = await params;
    
    await pool.query('DELETE FROM questions WHERE id = ?', [questionId]);

    return NextResponse.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
