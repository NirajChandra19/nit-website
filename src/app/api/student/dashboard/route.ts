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
      SELECT e.*, c.title as course_title, c.type as course_type
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

    // 4. Calculate stats using 4 new queries
    const [[{ coursesEnrolled }]]: any = await pool.query(`
      SELECT COUNT(*) as coursesEnrolled FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ? AND c.type = 'course'
    `, [studentId]);

    const [[{ courseCertificates }]]: any = await pool.query(`
      SELECT COUNT(*) as courseCertificates FROM certificates c JOIN courses co ON c.course_id = co.id WHERE c.student_id = ? AND co.type = 'course'
    `, [studentId]);

    const [[{ internshipsEnrolled }]]: any = await pool.query(`
      SELECT COUNT(*) as internshipsEnrolled FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ? AND c.type = 'internship'
    `, [studentId]);

    const [[{ internshipCertificates }]]: any = await pool.query(`
      SELECT COUNT(*) as internshipCertificates FROM certificates c JOIN courses co ON c.course_id = co.id WHERE c.student_id = ? AND co.type = 'internship'
    `, [studentId]);

    return NextResponse.json({
      profile: student,
      enrollments: enrollmentRows,
      certificates: certRows,
      stats: {
        coursesEnrolled: parseInt(coursesEnrolled, 10),
        courseCertificates: parseInt(courseCertificates, 10),
        internshipsEnrolled: parseInt(internshipsEnrolled, 10),
        internshipCertificates: parseInt(internshipCertificates, 10)
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
