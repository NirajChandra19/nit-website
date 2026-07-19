import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params;
    const { is_active } = await request.json();
    
    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ error: 'is_active must be a boolean' }, { status: 400 });
    }

    await pool.query('UPDATE exams SET is_active = ? WHERE id = ?', [is_active, examId]);

    return NextResponse.json({ success: true, message: `Exam status updated to ${is_active ? 'Active' : 'Inactive'}` });
  } catch (error) {
    console.error('Error toggling exam status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
