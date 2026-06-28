import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
    }

    // 1. Fetch certificate data, including duration and reg_id from the database
    const [rows]: any = await pool.query(`
      SELECT c.cert_id, s.name as student_name, s.reg_id, co.title as course_title, co.duration
      FROM certificates c
      JOIN students s ON c.student_id = s.id
      JOIN courses co ON c.course_id = co.id
      WHERE c.cert_id = ?
    `, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    const cert = rows[0];
    const studentName = cert.student_name || 'Student Name';
    const formattedName = studentName
      .split(' ')
      .map((word: string) => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
      .join(' ');
      
    const courseName = cert.course_title || 'Program Name';
    const duration = cert.duration ? `${cert.duration}` : '4'; 
    const regId = cert.reg_id || 'N/A'; // Extract Registration ID
    const certId = cert.cert_id; // Extract Certificate ID

    // 2. Read the blank PDF template and custom font from the filesystem
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'blank_certificate.pdf');
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Montserrat-SemiBold.ttf');
    
    let templateBytes;
    let fontBytes;
    try {
      templateBytes = await fs.promises.readFile(templatePath);
      fontBytes = await fs.promises.readFile(fontPath);
    } catch (fileError) {
      console.error('File Read Error:', fileError);
      return NextResponse.json(
        { error: 'Template or font file not found on the server. Ensure they exist at public/templates/blank_certificate.pdf and public/fonts/Montserrat-SemiBold.ttf' },
        { status: 500 }
      );
    }

    // 3. Load the document and register fontkit
    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);
    
    // Embed the fonts
    const customFont = await pdfDoc.embedFont(fontBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();
    
    // 4. Calculate Visual Center for Main Text
    const leftOffset = width * 0.18; 
    const usableWidth = width - leftOffset;
    const visualCenterX = leftOffset + (usableWidth / 2);

    // Name Coordinates
    const nameWidth = customFont.widthOfTextAtSize(formattedName, 40.2);
    const nameX = visualCenterX - (nameWidth / 2);
    const nameY = (height / 2) + 8; 

    // Subtext Line 1 
    const subTextSize = 13.5; 
    const subTextLine1 = `has successfully completed ${duration} weeks summer training on ${courseName}`;
    const subText1Width = helveticaFont.widthOfTextAtSize(subTextLine1, subTextSize);
    const subText1X = visualCenterX - (subText1Width / 2);
    const subText1Y = nameY - 55; 

    // Subtext Line 2
    const subTextLine2 = `at Nainital Institute of Technology, Nainital.`;
    const subText2Width = helveticaFont.widthOfTextAtSize(subTextLine2, subTextSize);
    const subText2X = visualCenterX - (subText2Width / 2);
    const subText2Y = subText1Y - 22; 

    // 5. Draw the Main Text
    page.drawText(formattedName, {
      x: nameX,
      y: nameY,
      size: 40.2,
      font: customFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText(subTextLine1, {
      x: subText1X,
      y: subText1Y,
      size: subTextSize,
      font: helveticaFont, 
      color: rgb(0.1, 0.1, 0.1), 
    });

    page.drawText(subTextLine2, {
      x: subText2X,
      y: subText2Y,
      size: subTextSize,
      font: helveticaFont, 
      color: rgb(0.1, 0.1, 0.1), 
    });

    // =========================================================
    // 6. Draw Registration & Certificate IDs (Exact Canva Coordinates)
    // =========================================================
    const idTextSize = 10; 
    const regIdString = `Registration Id:- ${regId}`;
    const certIdString = `Certificate Id:- ${certId}`;

    // Convert Canva's cm to pdf-lib points (1 cm ≈ 28.3465 points)
    const CM_TO_PT = 28.3465;

    // Apply the exact X coordinates from Canva
    const regIdX = 24.50 * CM_TO_PT;
    const certIdX = 23.75 * CM_TO_PT;

    // Calculate Y coordinates. (pdf-lib Y starts at bottom; Canva Y starts at top).
    // We subtract the text size to account for the font baseline.
    const regIdY = height - (2.98 * CM_TO_PT) - idTextSize; 
    const certIdY = height - (3.39 * CM_TO_PT) - idTextSize; 

    // Draw Registration ID (Top Line)
    page.drawText(regIdString, {
      x: regIdX, 
      y: regIdY,
      size: idTextSize,
      font: helveticaFont, // Matching your previous request for this font
      color: rgb(0.15, 0.15, 0.15), 
    });

    // Draw Certificate ID (Bottom Line)
    page.drawText(certIdString, {
      x: certIdX, 
      y: certIdY,
      size: idTextSize,
      font: helveticaFont, // Matching your previous request for this font
      color: rgb(0.15, 0.15, 0.15),
    });
    // =========================================================

    // 7. Serialize the PDF to bytes 
    const pdfBytesOutput = await pdfDoc.save();
    const responseBuffer = Buffer.from(pdfBytesOutput);

    // 8. Return the Magic Headers for Direct Download
    return new NextResponse(responseBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate_${id}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error('Server PDF Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error while generating PDF' }, { status: 500 });
  }
}