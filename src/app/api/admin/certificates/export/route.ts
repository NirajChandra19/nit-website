import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const dateFilter = searchParams.get('date') || 'all';
    const program = searchParams.get('program') || 'all';

    let whereClauses: string[] = [];
    let queryParams: any[] = [];

    if (search) {
      whereClauses.push('(s.name LIKE ? OR s.reg_id LIKE ? OR c.cert_id LIKE ?)');
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (dateFilter !== 'all') {
      if (dateFilter === 'today') {
        whereClauses.push('DATE(c.issue_date) = CURDATE()');
      } else if (dateFilter === 'last7days') {
        whereClauses.push('c.issue_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)');
      } else if (dateFilter === 'thismonth') {
        whereClauses.push('MONTH(c.issue_date) = MONTH(CURDATE()) AND YEAR(c.issue_date) = YEAR(CURDATE())');
      }
    }

    if (program !== 'all') {
      whereClauses.push('cr.title = ?');
      queryParams.push(program);
    }

    const whereString = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const dataQuery = `
      SELECT 
        c.cert_id, 
        s.name AS student_name, 
        s.reg_id
      FROM certificates c
      LEFT JOIN students s ON c.student_id = s.id
      LEFT JOIN courses cr ON c.course_id = cr.id
      ${whereString}
      ORDER BY c.issue_date DESC
    `;
    
    const [rows]: any = await pool.query(dataQuery, queryParams);

    // Format to CSV
    const csvHeader = 'Student Name,Registration ID,Certificate ID,Certificate Link\n';
    
    const domain = process.env.NEXT_PUBLIC_API_URL || 'https://nit-website.com';
    
    const csvRows = rows.map((row: any) => {
      // Escape commas and quotes within names
      const escapeCsv = (str: string) => {
        if (!str) return 'Ghost Account';
        const stringified = String(str);
        if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
          return `"${stringified.replace(/"/g, '""')}"`;
        }
        return stringified;
      };

      const certLink = `${domain}/api/certificates/download?id=${row.cert_id}`;
      
      return [
        escapeCsv(row.student_name),
        escapeCsv(row.reg_id),
        escapeCsv(row.cert_id),
        escapeCsv(certLink)
      ].join(',');
    });

    const csvContent = csvHeader + csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="certificates_export.csv"',
      },
    });

  } catch (error) {
    console.error('Database Error during export:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
