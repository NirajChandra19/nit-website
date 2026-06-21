import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'nit_secret_key_2026';

export async function GET(request: Request) {
  try {
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

    const [students]: any = await pool.query('SELECT last_notification_read_at FROM students WHERE id = ?', [studentId]);
    if (students.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const lastReadAt = new Date(students[0].last_notification_read_at || 0).getTime();

    const [notifications]: any = await pool.query(`
      SELECT id, title, message AS 'desc', type, created_at AS 'time'
      FROM notifications
      WHERE user_id = ? OR user_id IS NULL
      ORDER BY created_at DESC
      LIMIT 10
    `, [studentId]);

    const formattedNotifications = notifications.map((n: any) => {
      // Format time roughly
      const diffMs = Date.now() - new Date(n.time).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);
      let timeStr = 'Just now';
      if (diffDays > 0) timeStr = `${diffDays}d ago`;
      else if (diffHrs > 0) timeStr = `${diffHrs}h ago`;
      else if (diffMins > 0) timeStr = `${diffMins}m ago`;

      return {
        id: n.id,
        title: n.title,
        desc: n.desc,
        type: n.type,
        time: timeStr,
        unread: new Date(n.time).getTime() > lastReadAt
      };
    });

    return NextResponse.json(formattedNotifications);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
