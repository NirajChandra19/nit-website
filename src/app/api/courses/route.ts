import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await pool.query(
      `SELECT * FROM courses WHERE type = 'course'`
    );
    
    return NextResponse.json({
      success: true,
      courses: rows,
    });
  } catch (error) {
    console.error('Fetch Courses Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
