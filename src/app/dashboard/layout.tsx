import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';
import DashboardLayoutClient from './DashboardLayoutClient';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET || 'nit_secret_key_2026';

async function fetchDashboardData(studentId: number) {
  // 1. Get student profile
  const [studentRows]: any = await pool.query('SELECT id, name, reg_id, email, language, is_2fa_enabled FROM students WHERE id = ?', [studentId]);
  if (studentRows.length === 0) return null;
  const student = studentRows[0];

  // 2. Get enrollments with course details
  const [enrollmentRows]: any = await pool.query(`
    SELECT e.id, e.course_id, e.progress, e.status, e.enrolled_at, c.title as course_title, c.type as course_type
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ?
  `, [studentId]);

  // 3. Get certificates
  const [certRows]: any = await pool.query(`
    SELECT c.cert_id, c.type, c.issue_date, c.grade, c.course_id, co.title as course_title
    FROM certificates c
    JOIN courses co ON c.course_id = co.id
    WHERE c.student_id = ?
  `, [studentId]);

  // 4. Calculate stats
  const [[stats]]: any = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ? AND c.type = 'course') as coursesEnrolled,
      (SELECT COUNT(*) FROM certificates ce JOIN courses co ON ce.course_id = co.id WHERE ce.student_id = ? AND co.type = 'course') as courseCertificates,
      (SELECT COUNT(*) FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ? AND c.type = 'internship') as internshipsEnrolled,
      (SELECT COUNT(*) FROM certificates ce JOIN courses co ON ce.course_id = co.id WHERE ce.student_id = ? AND co.type = 'internship') as internshipCertificates
  `, [studentId, studentId, studentId, studentId]);

  return {
    profile: student,
    enrollments: enrollmentRows,
    certificates: certRows,
    stats: {
      coursesEnrolled: parseInt(stats.coursesEnrolled, 10),
      courseCertificates: parseInt(stats.courseCertificates, 10),
      internshipsEnrolled: parseInt(stats.internshipsEnrolled, 10),
      internshipCertificates: parseInt(stats.internshipCertificates, 10)
    }
  };
}

async function fetchActivity(studentId: number) {
  const [certRows]: any = await pool.query(`
    SELECT 
      c.cert_id as id,
      co.title,
      co.type as course_type,
      c.percentage,
      c.grade,
      c.issue_date
    FROM certificates c
    JOIN courses co ON c.course_id = co.id
    WHERE c.student_id = ?
    ORDER BY c.issue_date DESC
    LIMIT 3
  `, [studentId]);

  return certRows.map((row: any) => {
    const isInternship = row.course_type === 'internship';
    return {
      id: row.id,
      title: row.title,
      type: isInternship ? "Internship Completed" : "Assessment Passed",
      score: isInternship ? (row.grade || '') : `${row.percentage || 0}%`,
      time: new Date(row.issue_date).toLocaleDateString(),
      status: isInternship ? 'special' : 'success'
    };
  });
}

async function fetchNotifications(studentId: number) {
  const [students]: any = await pool.query('SELECT last_notification_read_at FROM students WHERE id = ?', [studentId]);
  const lastReadAt = new Date(students[0]?.last_notification_read_at || 0).getTime();

  const [notificationRows]: any = await pool.query(`
    SELECT id, title, message AS 'desc', type, created_at AS 'time'
    FROM notifications 
    WHERE user_id = ? OR user_id IS NULL
    ORDER BY created_at DESC LIMIT 10
  `, [studentId]);
  
  return notificationRows.map((n: any) => {
    const diffMs = Date.now() - new Date(n.time).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    let timeStr = 'Just now';
    if (diffDays > 0) timeStr = `${diffDays}d ago`;
    else if (diffHrs > 0) timeStr = `${diffHrs}h ago`;
    else if (diffMins > 0) timeStr = `${diffMins}m ago`;

    const isUnread = new Date(n.time).getTime() > lastReadAt;
    
    return {
      id: n.id,
      title: n.title,
      desc: n.desc,
      type: n.type,
      time: timeStr,
      unread: isUnread,
      isUnread: isUnread
    };
  });
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('nit_token')?.value;

  if (!token) {
    redirect('/login');
  }

  let studentId;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    studentId = payload.studentId as number;
  } catch (error) {
    redirect('/login');
  }

  const [dashboardData, activity, notifications] = await Promise.all([
    fetchDashboardData(studentId),
    fetchActivity(studentId),
    fetchNotifications(studentId)
  ]);

  return (
    <DashboardLayoutClient 
      initialData={dashboardData}
      initialActivity={activity}
      initialNotifications={notifications}
    >
      {children}
    </DashboardLayoutClient>
  );
}
