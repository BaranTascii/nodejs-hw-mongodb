import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
  console.warn('SMTP credentials are not set in env.');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD
  }
});

export const sendResetEmail = async ({ to, resetLink }) => {
  const mailOptions = {
    from: SMTP_FROM,
    to,
    subject: 'Password reset request',
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password. This link will expire in 5 minutes.</p>
      <a href="${resetLink}">Reset password</a>
      <p>If you didn't request this, ignore this email.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};
