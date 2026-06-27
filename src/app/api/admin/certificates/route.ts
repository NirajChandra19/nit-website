import { NextResponse } from 'next/server';
import pool, { generateCertificateId } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const dateFilter = searchParams.get('date') || 'all';
    const program = searchParams.get('program') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    let whereClauses: string[] = [];
    let queryParams: any[] = [];

    if (search) {
      whereClauses.push('(s.name LIKE ? OR s.reg_id LIKE ? OR c.cert_id LIKE ?)');
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (dateFilter !== 'all') {
      if (dateFilter === 'today') {
        whereClauses.push('DATE(c.issue_date) = CURDATE()');
      } else if (dateFilter === 'last7days') {
        whereClauses.push('c.issue_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)');
      } else if (dateFilter === 'thismonth') {
        whereClauses.push('MONTH(c.issue_date) = MONTH(CURDATE()) AND YEAR(c.issue_date) = YEAR(CURDATE())');
      }
    }

    if (program !== 'all') {
      whereClauses.push('cr.title = ?');
      queryParams.push(program);
    }

    const whereString = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const countQuery = `
      SELECT COUNT(*) as total
      FROM certificates c
      LEFT JOIN students s ON c.student_id = s.id
      LEFT JOIN courses cr ON c.course_id = cr.id
      ${whereString}
    `;
    const [countResult]: any = await pool.query(countQuery, queryParams);
    const totalCount = countResult[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    const dataQuery = `
      SELECT 
        c.cert_id, c.type, c.issue_date, c.grade, c.percentage, c.verification_url, c.course_id,
        s.name AS student_name, s.reg_id,
        cr.title AS course_title, cr.duration
      FROM certificates c
      LEFT JOIN students s ON c.student_id = s.id
      LEFT JOIN courses cr ON c.course_id = cr.id
      ${whereString}
      ORDER BY c.issue_date DESC
      LIMIT ? OFFSET ?
    `;
    
    // Add pagination params
    const finalParams = [...queryParams, limit, offset];
    const [rows] = await pool.query(dataQuery, finalParams);
    
    return NextResponse.json({ certificates: rows, totalPages });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reg_id, course_id, type, grade, percentage, issue_date, isNewStudent, student_name } = body;

    if (!course_id || !type || !issue_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let student_id;

    if (isNewStudent) {
      if (!student_name) {
        return NextResponse.json({ error: 'Student name is required for new students' }, { status: 400 });
      }
      
      const newRegId = `NIT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const [insertResult]: any = await pool.query(
        'INSERT INTO students (name, email, password, reg_id) VALUES (?, ?, ?, ?)',
        [student_name, `ghost_${Date.now()}@temp.nit`, 'ghost', newRegId]
      );
      
      student_id = insertResult.insertId;
    } else {
      if (!reg_id) {
        return NextResponse.json({ error: 'Registration ID is required for existing students' }, { status: 400 });
      }
      
      const [students]: any = await pool.query('SELECT id FROM students WHERE reg_id = ?', [reg_id]);
      
      if (students.length === 0) {
        return NextResponse.json({ error: 'Student not found with that Registration ID' }, { status: 404 });
      }
      
      student_id = students[0].id;
    }
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

    // Auto-cleanup mechanism to silently remove notifications older than 2 days
    pool.query('DELETE FROM notifications WHERE created_at < NOW() - INTERVAL 2 DAY').catch(err => console.error('Auto-cleanup error:', err));

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
