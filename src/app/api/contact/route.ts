import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize the Resend client (runs instantly)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, message } = await request.json();

    // Send the email via HTTP API (takes ~200ms)
    const { data, error } = await resend.emails.send({
      from: `NIT Support <contact@nainitalinstituteoftechnology.com>`,
      replyTo: email, 
      to: ['contact@nainitalinstituteoftechnology.com'],
      subject: `New Support Request from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0F172A;">New Support Request</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}