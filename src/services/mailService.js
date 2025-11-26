import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
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
    `,
  };
  return transporter.sendMail(mailOptions);
};
