import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params;
    
    // Using ON DELETE CASCADE so deleting exam deletes questions and submissions
    await pool.query('DELETE FROM exams WHERE id = ?', [examId]);

    return NextResponse.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
