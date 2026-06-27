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
    const [certRows]: any = await pool.query(`
      SELECT 
        c.cert_id as id,
        co.title,
        co.type as course_type,
        c.percentage,
        c.grade,
        c.issue_date
      FROM certificates c
      JOIN courses co ON c.course_id = co.id
      WHERE c.student_id = ?
      ORDER BY c.issue_date DESC
      LIMIT 3
    `, [studentId]);

    const activity = certRows.map((row: any) => {
      const isInternship = row.course_type === 'internship';
      
      return {
        id: row.id,
        title: row.title,
        type: isInternship ? "Internship Completed" : "Assessment Passed",
        score: isInternship ? (row.grade || '') : `${row.percentage || 0}%`,
        time: new Date(row.issue_date).toLocaleDateString(),
        status: isInternship ? 'special' : 'success'
      };
    });

    return NextResponse.json(activity);

  } catch (error) {
    console.error('Activity API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
