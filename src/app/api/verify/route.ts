import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const certId = searchParams.get('id');

  if (!certId) {
    return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query(`
      SELECT 
        c.cert_id, 
        c.type, 
        c.issue_date, 
        c.grade, 
        c.percentage,
        s.name as student_name, 
        s.reg_id,
        co.title as course_title
      FROM certificates c
      JOIN students s ON c.student_id = s.id
      JOIN courses co ON c.course_id = co.id
      WHERE c.cert_id = ?
    `, [certId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
