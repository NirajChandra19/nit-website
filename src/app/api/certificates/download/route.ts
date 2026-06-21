import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Certificate ID is required', { status: 400 });
  }

  try {
    const [rows]: any = await pool.query(`
      SELECT c.*, s.name as student_name, co.title as course_title
      FROM certificates c
      JOIN students s ON c.student_id = s.id
      JOIN courses co ON c.course_id = co.id
      WHERE c.cert_id = ?
    `, [id]);

    if (rows.length === 0) {
      return new NextResponse('Certificate not found', { status: 404 });
    }

    const cert = rows[0];
    const issueDate = new Date(cert.issue_date).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${cert.cert_id}</title>
        <style>
          @page { size: landscape; margin: 0; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fff; }
          .certificate { width: 1000px; height: 700px; padding: 40px; text-align: center; border: 15px solid #0f172a; position: relative; background: linear-gradient(135deg, #f8fafc, #eff6ff); box-sizing: border-box; }
          .inner-border { border: 2px solid #3b82f6; width: 100%; height: 100%; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
          .logo { font-size: 32px; font-weight: bold; color: #0f172a; margin-bottom: 20px; font-family: Georgia, serif; }
          .logo span { color: #3b82f6; }
          .header { font-size: 48px; font-weight: bold; color: #0f172a; margin-bottom: 10px; font-family: Georgia, serif; }
          .subheader { font-size: 20px; color: #64748b; margin-bottom: 40px; letter-spacing: 2px; text-transform: uppercase; }
          .presented-to { font-size: 18px; color: #64748b; margin-bottom: 10px; }
          .name { font-size: 42px; font-weight: bold; color: #1e40af; margin-bottom: 30px; font-family: Georgia, serif; border-bottom: 2px solid #93c5fd; padding-bottom: 10px; display: inline-block; min-width: 400px; }
          .reason { font-size: 18px; color: #64748b; margin-bottom: 10px; }
          .course { font-size: 32px; font-weight: bold; color: #0f172a; margin-bottom: 50px; }
          .footer { display: flex; justify-content: space-between; width: 80%; position: absolute; bottom: 50px; }
          .signature { border-top: 1px solid #cbd5e1; width: 250px; padding-top: 10px; font-size: 16px; color: #475569; }
          .badge { position: absolute; top: 40px; right: 40px; width: 100px; height: 100px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; text-align: center; border: 4px solid #eff6ff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
          .credential-id { font-size: 12px; color: #94a3b8; position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="inner-border">
            <div class="badge">Official<br/>Certified</div>
            <div class="logo">NIT<span>.</span></div>
            <div class="header">Certificate of Completion</div>
            <div class="subheader">This is proudly presented to</div>
            <div class="name">${cert.student_name}</div>
            <div class="reason">for successfully completing the requirements of</div>
            <div class="course">${cert.course_title}</div>
            <div class="footer">
              <div class="signature">
                <strong>Issue Date</strong><br/>
                ${issueDate}
              </div>
              <div class="signature">
                <strong>Grade</strong><br/>
                ${cert.grade || 'Completed'}
              </div>
            </div>
            <div class="credential-id">Credential ID: ${cert.cert_id}</div>
          </div>
        </div>
        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => { window.close(); }, 1000);
          }
        </script>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
