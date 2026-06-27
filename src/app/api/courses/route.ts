import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { unstable_cache } from 'next/cache';

const getCachedCourses = unstable_cache(
  async () => {
    const [rows]: any = await pool.query(
      `SELECT id, title, category, description, duration, applicant_count AS users, icon_name FROM courses WHERE type = 'course' ORDER BY created_at DESC LIMIT 50 OFFSET 0`
    );
    return rows;
  },
  ['public-courses'],
  { revalidate: 3600, tags: ['courses'] }
);

export async function GET() {
  try {
    const rows = await getCachedCourses();
    
    return NextResponse.json({
      success: true,
      courses: rows,
    });
  } catch (error) {
    console.error('Fetch Courses Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
