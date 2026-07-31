import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize the Resend client (runs instantly)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, message, interestedIn } = await request.json();

    const isProjectInquiry = !!interestedIn;
    const subject = isProjectInquiry 
      ? `Project Consultation: ${interestedIn} from ${firstName} ${lastName}`
      : `New Support Request from ${firstName} ${lastName}`;

    const title = isProjectInquiry ? 'New Project Consultation Request' : 'New Support Request';

    // Send the email via HTTP API (takes ~200ms)
    const { data, error } = await resend.emails.send({
      from: `NIT Contact <contact@nainitalinstituteoftechnology.com>`,
      replyTo: email, 
      to: ['contact@nainitalinstituteoftechnology.com'],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0F172A; margin-top: 0;">${title}</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${isProjectInquiry ? `<p><strong>Service of Interest:</strong> ${interestedIn}</p>` : ''}
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p><strong>Message / Project Details:</strong></p>
          <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #f1f5f9; color: #334155;">${message}</p>
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