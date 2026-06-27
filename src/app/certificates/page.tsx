import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';
import { redirect } from 'next/navigation';
import CertificatesClient from './CertificatesClient';

const JWT_SECRET = process.env.JWT_SECRET || 'nit_secret_key_2026';

export default async function CertificatesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('nit_token')?.value;

  if (!token) {
    redirect('/login');
  }

  let studentId;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    studentId = payload.studentId as number;
  } catch (error) {
    redirect('/login');
  }

  // Fetch student profile for name and reg_id
  const [studentRows]: any = await pool.query('SELECT name, reg_id FROM students WHERE id = ?', [studentId]);
  const student = studentRows[0] || {};

  // Fetch certificates
  const [certRows]: any = await pool.query(`
    SELECT c.cert_id, c.type, c.issue_date, c.grade, c.course_id, co.title as course_title, co.duration
    FROM certificates c
    JOIN courses co ON c.course_id = co.id
    WHERE c.student_id = ?
  `, [studentId]);

  // Fetch enrollments (in-progress)
  const [enrollmentRows]: any = await pool.query(`
    SELECT e.id, e.course_id, e.progress, e.status, e.enrolled_at, c.title as course_title, c.type as course_type
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ? AND e.status != 'completed' AND e.progress < 100
  `, [studentId]);

  return (
    <CertificatesClient 
      initialCertificates={certRows} 
      initialEnrollments={enrollmentRows} 
      studentName={student.name}
      studentRegId={student.reg_id}
    />
  );
}