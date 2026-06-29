import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true, // Keep connection open
  maxConnections: 1,
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  return await transporter.sendMail({
    from: `"NIT Student Portal" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};