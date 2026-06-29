import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { unstable_cache, revalidateTag } from 'next/cache';

const getCachedCourses = unstable_cache(
  async (type: string | null, limit: number, offset: number) => {
    let query = 'SELECT id, title, type, category, description, duration, applicant_count AS users, icon_name, created_at FROM courses';
    const params: any[] = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
  },
  // KEY FIX: Include parameters in the key so different queries get different cache entries
  ['courses-list'], 
  { revalidate: 3600, tags: ['courses'] } 
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Pass params to the cached function
    const rows = await getCachedCourses(type, limit, offset);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Added duration here to match your form
    let { title, type, category, description, icon_name, duration } = body;

    if (!title || !type || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // FIX: Included duration in the INSERT query
    const [result]: any = await pool.query(
      'INSERT INTO courses (title, type, category, description, icon_name, duration) VALUES (?, ?, ?, ?, ?, ?)',
      [title, type, category, description || '', icon_name || 'FiBookOpen', duration || null]
    );

    await pool.query(
      'INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)',
      ['New Skill Course', `${title} is now available!`, 'course']
    );

    pool.query('DELETE FROM notifications WHERE created_at < NOW() - INTERVAL 2 DAY').catch(console.error);

    // Correct usage of revalidateTag
    revalidateTag('courses', 'default');

    return NextResponse.json({ 
      message: 'Course/Internship created successfully', 
      id: result.insertId 
    }, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}