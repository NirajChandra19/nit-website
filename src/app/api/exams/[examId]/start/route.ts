import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_scholarship_key');

interface StartRequest {
  name: string;
  phone: string;
  email: string;
  college: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params;
    const body: StartRequest = await request.json();
    const { name, phone, email, college } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Full Name is required' }, { status: 400 });
    }

    if (!college || !college.trim()) {
      return NextResponse.json({ error: 'College name is required' }, { status: 400 });
    }

    const phoneRegex = /^(?:\+91\s?)?[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 1. Check if phone already submitted this exam
    const [existing] = await pool.query<any[]>(
      'SELECT id FROM submissions WHERE exam_id = ? AND phone_number = ?',
      [examId, phone]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'A submission with this phone number already exists.' },
        { status: 409 }
      );
    }

    // 2. Fetch exam to verify and get duration
    const [exams] = await pool.query<any[]>(
      'SELECT id, duration_minutes FROM exams WHERE id = ?',
      [examId]
    );

    if (exams.length === 0) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }
    const duration = exams[0].duration_minutes || 30;

    // 3. Fetch questions (excluding answer)
    const [questions] = await pool.query<any[]>(
      'SELECT id, question_text, options FROM questions WHERE exam_id = ?',
      [examId]
    );

    // 4. Generate short-lived JWT (e.g., duration + 5 mins buffer)
    const token = await new SignJWT({ name, phone, email, college, examId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${duration + 5}m`)
      .sign(JWT_SECRET);

    return NextResponse.json({
      token,
      durationMinutes: duration,
      questions: questions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      }))
    });
  } catch (error) {
    console.error('Start Exam Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
