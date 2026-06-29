import { NextResponse } from 'next/server';
import pool, { generateCertificateId } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  
  try {
    const body = await request.json();
    const { studentId, selectedAnswers } = body;

    if (!studentId || !selectedAnswers) {
      return NextResponse.json({ error: 'Missing payload data' }, { status: 400 });
    }

    const questionIds = Object.keys(selectedAnswers);
    
    let totalQuestions = 0;
    let correctCount = 0;

    if (questionIds.length > 0) {
      const placeholders = questionIds.map(() => '?').join(',');
      const [rows]: any = await pool.query(
        `SELECT id, correct_answer FROM questions WHERE id IN (${placeholders}) AND course_id = ?`,
        [...questionIds, courseId]
      );

      totalQuestions = rows.length;

      rows.forEach((row: any) => {
        if (selectedAnswers[row.id] === row.correct_answer) {
          correctCount++;
        }
      });
    }

    const baseTotal = 15;
    const scorePercentage = (correctCount / baseTotal) * 100;

    const [courseRows]: any = await pool.query('SELECT type, title FROM courses WHERE id = ?', [courseId]);
    const requiredPercentage = 60;

    const passed = scorePercentage >= requiredPercentage;

    let certificate_id = null;

    if (passed) {
      await pool.query(
        'UPDATE enrollments SET progress = 100, status = "completed" WHERE student_id = ? AND course_id = ?',
        [studentId, courseId]
      );

      // Certificate Generation Logic
      const [existingCert]: any = await pool.query(
        'SELECT cert_id FROM certificates WHERE student_id = ? AND course_id = ?',
        [studentId, courseId]
      );

      if (existingCert.length === 0) {
        let isCertInserted = false;
        let attempts = 0;
        let cert_id = '';
        const courseType = courseRows[0]?.type || 'course';
        const courseTitle = courseRows[0]?.title || 'Course';
        const issueDate = new Date().toISOString().split('T')[0];
        
        while (!isCertInserted && attempts < 5) {
          cert_id = generateCertificateId();
          const uniqueHash = crypto.randomBytes(16).toString('hex');
          const verification_url = `${process.env.NEXT_PUBLIC_API_URL || ''}/verification?id=${cert_id}&hash=${uniqueHash}`;
          attempts++;

          try {
            await pool.query(
              'INSERT INTO certificates (cert_id, student_id, course_id, type, issue_date, grade, percentage, verification_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [cert_id, studentId, courseId, courseType, issueDate, null, Math.round(scorePercentage), verification_url]
            );
            isCertInserted = true;
          } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY' && err.message.includes('cert_id')) {
              continue;
            }
            throw err;
          }
        }

        if (!isCertInserted) {
          throw new Error('Failed to generate unique Certificate ID');
        }

        certificate_id = cert_id;

        await pool.query(
          'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
          [studentId, 'New Certificate', `Your certificate for ${courseTitle} is ready!`, 'certificate']
        );
        await pool.query('DELETE FROM notifications WHERE created_at < NOW() - INTERVAL 2 DAY').catch(() => {});
      } else {
        certificate_id = existingCert[0].cert_id;
      }
    }

    return NextResponse.json({
      score: correctCount,
      total: baseTotal,
      percentage: Math.round(scorePercentage),
      passed,
      certificate_id,
      message: passed ? 'Congratulations! You passed the assessment.' : 'You did not meet the required score. Please review the material and try again.'
    });

  } catch (error) {
    console.error('Quiz Grade Error:', error);
    return NextResponse.json({ error: 'Failed to grade quiz' }, { status: 500 });
  }
}
