import nodemailer from 'nodemailer';

// Create a reusable transporter using environment variables
// Configure SMTP host, port and auth. For Gmail or other providers, set these appropriately.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Simple function to send an email. Accepts text or HTML.
export async function sendEmail({ to, subject, text, html }) {
  // From address defaults to EMAIL_USER
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const info = await transporter.sendMail({ from, to, subject, text, html });
  return info; // contains messageId, etc.
}

// Optionally verify transporter on startup. You can call transporter.verify() in server bootstrap if needed.
export async function verifyEmailTransport() {
  // Returns true if SMTP server is ready to accept messages
  await transporter.verify();
  return true;
}
