import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  try {
    const [rows]: any = await pool.query(
      'SELECT id, course_id, question_text, options FROM questions WHERE course_id = ? ORDER BY RAND() LIMIT 15',
      [courseId]
    );

    // Ensure options are parsed, but CRITICALLY: correct_answer is NOT selected from DB
    const safeQuestions = rows.map((q: any) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    // Fetch course details like duration limits
    const [courseRows]: any = await pool.query('SELECT title FROM courses WHERE id = ?', [courseId]);
    const course = courseRows[0];

    return NextResponse.json({
      courseTitle: course?.title,
      passPercentage: '> 60%',
      questions: safeQuestions,
      timeLimitMinutes: 10 // Fixed settings from requirements
    });
  } catch (error) {
    console.error('Quiz Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}
