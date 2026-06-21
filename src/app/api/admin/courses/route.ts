import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all courses
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = 'SELECT id, title, type, category, description, icon_name, created_at FROM courses';
    const params: any[] = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST new course/internship
export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { title, type, category, description, icon_name, company_name, stipend, location } = body;

    if (!title || !type || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      'INSERT INTO courses (title, type, category, description, icon_name) VALUES (?, ?, ?, ?, ?)',
      [title, type, category, description || '', icon_name || 'FiBookOpen']
    );

    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (NULL, ?, ?, ?)',
      ['New Skill Course', `${title} is now available!`, 'course']
    );

    // Auto-cleanup mechanism to silently remove notifications older than 5 days
    pool.query('DELETE FROM notifications WHERE created_at < NOW() - INTERVAL 5 DAY').catch(err => console.error('Auto-cleanup error:', err));

    return NextResponse.json({ 
      message: 'Course/Internship created successfully', 
      id: result.insertId 
    }, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
