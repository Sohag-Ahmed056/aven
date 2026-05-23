import nodemailer from 'nodemailer';
import config from '../../config/index.js';

interface ISendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: ISendEmailOptions): Promise<void> => {
  // If SMTP is not fully configured, log the email in development instead of throwing
  if (!config.email.user || !config.email.pass) {
    console.log(`✉️ [SMTP Mock Mode] Email to: ${to}, Subject: ${subject}`);
    console.log(`Body: ${html.substring(0, 300)}...`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465, // true for 465, false for other ports
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
  });
};
