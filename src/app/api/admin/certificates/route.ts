import { NextResponse } from 'next/server';
import pool, { generateCertificateId } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const query = `
      SELECT 
        c.cert_id, c.type, c.issue_date, c.grade, c.percentage, c.verification_url, c.course_id,
        s.name AS student_name, s.reg_id,
        cr.title AS course_title
      FROM certificates c
      LEFT JOIN students s ON c.student_id = s.id
      LEFT JOIN courses cr ON c.course_id = cr.id
      ORDER BY c.issue_date DESC
    `;
    const [rows] = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reg_id, course_id, type, grade, percentage, issue_date } = body;

    if (!reg_id || !course_id || !type || !issue_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Lookup internal student_id using the public reg_id
    const [students]: any = await pool.query('SELECT id FROM students WHERE reg_id = ?', [reg_id]);
    
    if (students.length === 0) {
      return NextResponse.json({ error: 'Student not found with that Registration ID' }, { status: 404 });
    }

    const student_id = students[0].id;
    const cert_id = generateCertificateId();
    
    // Generate a unique crypto hash for verification
    const uniqueHash = crypto.randomBytes(16).toString('hex');
    const verification_url = `${process.env.NEXT_PUBLIC_API_URL || ''}/verification?id=${cert_id}&hash=${uniqueHash}`;

    const finalGrade = type === 'course' ? null : (grade || 'A');
    const finalPercentage = type === 'course' ? (percentage ? parseInt(percentage) : null) : null;

    const [result]: any = await pool.query(
      'INSERT INTO certificates (cert_id, student_id, course_id, type, issue_date, grade, percentage, verification_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [cert_id, student_id, course_id, type, issue_date, finalGrade, finalPercentage, verification_url]
    );

    const [courseResult]: any = await pool.query('SELECT title FROM courses WHERE id = ?', [course_id]);
    const programName = courseResult.length > 0 ? courseResult[0].title : 'Program';
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [student_id, 'New Certificate', `Your certificate for ${programName} is ready!`, 'certificate']
    );

    // Auto-cleanup mechanism to silently remove notifications older than 5 days
    pool.query('DELETE FROM notifications WHERE created_at < NOW() - INTERVAL 5 DAY').catch(err => console.error('Auto-cleanup error:', err));

    return NextResponse.json({ 
      message: 'Certificate issued successfully', 
      cert_id: cert_id,
      id: result.insertId 
    }, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
