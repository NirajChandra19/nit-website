import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'nit_secret_key_2026';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('nit_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let studentId;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    studentId = payload.studentId;
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get student profile
    const [studentRows]: any = await pool.query('SELECT id, name, reg_id, email, language, is_2fa_enabled FROM students WHERE id = ?', [studentId]);
    if (studentRows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    const student = studentRows[0];

    // 2. Get enrollments with course details
    const [enrollmentRows]: any = await pool.query(`
      SELECT e.id, e.course_id, e.progress, e.status, e.enrolled_at, c.title as course_title, c.type as course_type
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
    `, [studentId]);

    // 3. Get certificates
    const [certRows]: any = await pool.query(`
      SELECT c.cert_id, c.type, c.issue_date, c.grade, c.course_id, co.title as course_title
      FROM certificates c
      JOIN courses co ON c.course_id = co.id
      WHERE c.student_id = ?
    `, [studentId]);

    // 4. Calculate stats using a single query to eliminate N+1/multiple queries
    const [[stats]]: any = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ? AND c.type = 'course') as coursesEnrolled,
        (SELECT COUNT(*) FROM certificates ce JOIN courses co ON ce.course_id = co.id WHERE ce.student_id = ? AND co.type = 'course') as courseCertificates,
        (SELECT COUNT(*) FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ? AND c.type = 'internship') as internshipsEnrolled,
        (SELECT COUNT(*) FROM certificates ce JOIN courses co ON ce.course_id = co.id WHERE ce.student_id = ? AND co.type = 'internship') as internshipCertificates
    `, [studentId, studentId, studentId, studentId]);

    return NextResponse.json({
      profile: student,
      enrollments: enrollmentRows,
      certificates: certRows,
      stats: {
        coursesEnrolled: parseInt(stats.coursesEnrolled, 10),
        courseCertificates: parseInt(stats.courseCertificates, 10),
        internshipsEnrolled: parseInt(stats.internshipsEnrolled, 10),
        internshipCertificates: parseInt(stats.internshipCertificates, 10)
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
