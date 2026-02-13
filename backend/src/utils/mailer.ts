import nodemailer from 'nodemailer';
import { env } from '../config/env';

const port = Number(env.SMTP_PORT);

export const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

export const sendOtpEmail = async (email: string, otp: string) => {
  await mailer.sendMail({
    from: env.SENDER_EMAIL,
    to: email,
    subject: 'Verify your email address',
    text: `Your verification code is ${otp}. It expires in 10 minutes.`
  });
};

export const sendCampaignCreatedEmail = async (payload: {
  title: string;
  category: string;
  goalAmount: number;
  organizerEmail?: string;
}) => {
  if (!env.ADMIN_EMAIL) {
    return;
  }

  await mailer.sendMail({
    from: env.SENDER_EMAIL,
    to: env.ADMIN_EMAIL,
    subject: 'New campaign created',
    text: `A new campaign was created.\n\nTitle: ${payload.title}\nCategory: ${payload.category}\nGoal: ETB ${payload.goalAmount}\nOrganizer: ${payload.organizerEmail ?? 'Unknown'}\n`
  });
};
