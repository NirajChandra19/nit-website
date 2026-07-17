import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { jwtVerify } from 'jose';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_scholarship_key');

interface SubmitRequest {
  token: string;
  answers: Record<string, string>; // question_id -> option text
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params;
    const body: SubmitRequest = await request.json();
    const { token, answers } = body;

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    // 1. Verify Token
    let payload;
    try {
      const { payload: jwtPayload } = await jwtVerify(token, JWT_SECRET);
      payload = jwtPayload;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { name, phone, email, college, examId: tokenExamId } = payload as any;

    if (String(tokenExamId) !== String(examId)) {
      return NextResponse.json({ error: 'Token exam mismatch' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 2. Double check if already submitted (concurrency prevention with row/gap lock)
      const [existing] = await connection.query<any[]>(
        'SELECT id FROM submissions WHERE exam_id = ? AND phone_number = ? FOR UPDATE',
        [examId, phone]
      );

      if (existing.length > 0) {
        await connection.rollback();
        return NextResponse.json(
          { error: 'A submission with this phone number already exists.' },
          { status: 409 }
        );
      }

      // 3. Fetch correct answers for this exam
      const [questions] = await connection.query<any[]>(
        'SELECT id, correct_answer FROM questions WHERE exam_id = ?',
        [examId]
      );

      if (questions.length === 0) {
        await connection.rollback();
        return NextResponse.json({ error: 'No questions found for this exam' }, { status: 404 });
      }

      // 4. Grading logic
      let correctCount = 0;
      const totalQuestions = questions.length;

      for (const q of questions) {
        const studentAnswer = answers[String(q.id)];
        if (studentAnswer && studentAnswer === q.correct_answer) {
          correctCount++;
        }
      }

      const accuracy = (correctCount / totalQuestions) * 100;
      const wrongCount = totalQuestions - correctCount;
      const submissionId = crypto.randomUUID();

      // 5. Insert submission
      await connection.query(
        `INSERT INTO submissions 
        (id, exam_id, student_name, phone_number, email, college, total_questions, correct_count, wrong_count) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [submissionId, examId, name, phone, email, college, totalQuestions, correctCount, wrongCount]
      );

      await connection.commit();

      return NextResponse.json({
        success: true,
        result: {
          correctCount,
          totalQuestions,
          accuracy: accuracy.toFixed(2)
        }
      });
    } catch (dbError) {
      await connection.rollback();
      throw dbError; // Forward to outer try-catch
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Submit Exam Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
