import { Metadata } from 'next';
import pool from '@/lib/db';
import VerificationClient from './VerificationClient';

// Helper function to fetch certificate data securely on the server
async function getCertificate(id?: string) {
  if (!id) return null;
  
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        c.cert_id, 
        c.type, 
        c.issue_date, 
        c.grade, 
        c.percentage,
        s.name as student_name, 
        s.reg_id,
        co.title as course_title,
        co.duration
      FROM certificates c
      JOIN students s ON c.student_id = s.id
      JOIN courses co ON c.course_id = co.id
      WHERE c.cert_id = ?
    `, [id.trim()]);

    if (rows.length === 0) return null;

    const result = rows[0];
    
    // Map backend fields to frontend interface
    return {
      studentName: result.student_name,
      courseName: result.course_title,
      issueDate: new Date(result.issue_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      grade: result.grade,
      percentage: result.percentage,
      credentialId: result.cert_id,
      type: result.type,
      studentRegId: result.reg_id,
      duration: result.duration
    };
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

// 1. DYNAMIC METADATA GENERATION FOR SOCIAL MEDIA (LINKEDIN, TWITTER, ETC.)
export async function generateMetadata(
  props: { searchParams: Promise<{ id?: string }> }
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const id = searchParams.id;
  
  if (!id) {
    return {
      title: 'Verify Certificate | NIT',
      description: 'Verify NIT certificates and credentials securely online.',
    };
  }

  const cert = await getCertificate(id);

  if (!cert) {
    return {
      title: 'Certificate Not Found | NIT',
      description: 'The certificate you are looking for could not be found or is invalid.',
    };
  }

  const ogTitle = `${cert.studentName} - Verified ${cert.type === 'internship' ? 'Internship' : 'Course'} Certificate`;
  const ogDescription = `NIT officially verifies that ${cert.studentName} has successfully completed the "${cert.courseName}" program on ${cert.issueDate} with a grade of ${cert.grade}.`;

  return {
    title: ogTitle,
    description: ogDescription,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'website',
      siteName: 'NIT Credential Verification',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
    }
  };
}

// 2. SERVER COMPONENT (Fetches data instantly, eliminating client-side waterfall)
export default async function VerificationPage(
  props: { searchParams: Promise<{ id?: string }> }
) {
  const searchParams = await props.searchParams;
  const id = searchParams.id || '';
  
  let initialData = null;
  let initialError = "";

  if (id) {
    initialData = await getCertificate(id);
    if (!initialData) {
      initialError = "No certificate found with this ID. Please check and try again.";
    }
  }

  return (
    <VerificationClient 
      initialId={id} 
      initialData={initialData}
      initialError={initialError}
    />
  );
}