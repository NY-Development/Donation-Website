import nodemailer from 'nodemailer';
import path from 'path';
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

const logoCid = 'impact-logo';
const logoPath = path.resolve(__dirname, '../assets/image.png');

const logoAttachment = {
  filename: 'image.png',
  path: logoPath,
  cid: logoCid
};

const emailLayout = (payload: {
  preheader: string;
  title: string;
  subtitle: string;
  bodyHtml: string;
  footerNote?: string;
}) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${payload.title}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f1fb;font-family:Segoe UI,Arial,sans-serif;color:#1f2937;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${payload.preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1fb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #ece7fa;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(127,19,236,0.08);">
            <tr>
              <td style="padding:28px 28px 18px;background:linear-gradient(135deg,#7f13ec 0%,#5b21b6 100%);text-align:center;">
                <img src="cid:${logoCid}" alt="Impact" width="64" height="64" style="display:block;margin:0 auto 14px;border-radius:12px;background:#fff;padding:6px;" />
                <h1 style="margin:0;color:#ffffff;font-size:24px;line-height:1.2;font-weight:800;">${payload.title}</h1>
                <p style="margin:10px 0 0;color:#e9dcff;font-size:14px;line-height:1.5;">${payload.subtitle}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 28px 20px;">
                ${payload.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 28px;border-top:1px solid #f0ecfb;">
                <p style="margin:0;color:#7a7a8a;font-size:12px;line-height:1.6;">${payload.footerNote ?? 'You are receiving this email because you have an account or activity on ImpactGive.'}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const sendOtpEmail = async (email: string, otp: string) => {
  const html = emailLayout({
    preheader: `Your verification code is ${otp}. It expires in 10 minutes.`,
    title: 'Verify your email',
    subtitle: 'Use the one-time code below to complete your sign in securely.',
    bodyHtml: `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151;">Welcome! Use this verification code to continue:</p>
      <div style="margin:16px 0 18px;padding:14px 16px;background:#f3edff;border:1px dashed #c4b5fd;border-radius:14px;text-align:center;">
        <span style="font-size:34px;letter-spacing:8px;font-weight:800;color:#5b21b6;">${otp}</span>
      </div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#4b5563;">This code expires in <strong>10 minutes</strong>.</p>
      <p style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;">If you did not request this, you can safely ignore this email.</p>
    `
  });

  await mailer.sendMail({
    from: env.SENDER_EMAIL,
    to: email,
    subject: 'Verify your email address',
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    html,
    attachments: [logoAttachment]
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

  const html = emailLayout({
    preheader: `New campaign created: ${payload.title}`,
    title: 'New campaign submitted',
    subtitle: 'A campaign was created and may need your review.',
    bodyHtml: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 10px;">
        <tr>
          <td style="padding:10px 12px;background:#faf8ff;border:1px solid #ede9fe;border-radius:10px;font-size:14px;"><strong>Title:</strong> ${payload.title}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;background:#faf8ff;border:1px solid #ede9fe;border-radius:10px;font-size:14px;"><strong>Category:</strong> ${payload.category}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;background:#faf8ff;border:1px solid #ede9fe;border-radius:10px;font-size:14px;"><strong>Goal:</strong> ETB ${payload.goalAmount}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;background:#faf8ff;border:1px solid #ede9fe;border-radius:10px;font-size:14px;"><strong>Organizer:</strong> ${payload.organizerEmail ?? 'Unknown'}</td>
        </tr>
      </table>
      <p style="margin:14px 0 0;font-size:13px;line-height:1.7;color:#6b7280;">Open the admin dashboard to review and moderate this campaign.</p>
    `,
    footerNote: 'This is an automated admin notification from ImpactGive.'
  });

  await mailer.sendMail({
    from: env.SENDER_EMAIL,
    to: env.ADMIN_EMAIL,
    subject: 'New campaign created',
    text: `A new campaign was created.\n\nTitle: ${payload.title}\nCategory: ${payload.category}\nGoal: ETB ${payload.goalAmount}\nOrganizer: ${payload.organizerEmail ?? 'Unknown'}\n`,
    html,
    attachments: [logoAttachment]
  });
};

export const sendOrganizerVerificationApprovedEmail = async (payload: {
  email: string;
  name?: string;
}) => {
  const html = emailLayout({
    preheader: 'Your organizer verification has been approved.',
    title: 'Verification approved',
    subtitle: `Great news, ${payload.name ?? 'there'}!`,
    bodyHtml: `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151;">Your organizer verification is now approved.</p>
      <div style="margin:14px 0;padding:12px 14px;border:1px solid #d1fae5;background:#ecfdf5;border-radius:12px;color:#065f46;font-size:14px;line-height:1.6;">
        You can now create and manage campaigns from your dashboard.
      </div>
      <p style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;">Thank you for helping our community with transparent fundraising.</p>
    `
  });

  await mailer.sendMail({
    from: env.SENDER_EMAIL,
    to: payload.email,
    subject: 'Your organizer verification is approved',
    text: `Hi ${payload.name ?? 'there'},\n\nGreat news! Your organizer verification has been approved. You can now create and manage campaigns.\n\nThank you for helping our community.\n`,
    html,
    attachments: [logoAttachment]
  });
};

export const sendOrganizerVerificationRejectedEmail = async (payload: {
  email: string;
  name?: string;
  reason?: string;
}) => {
  const html = emailLayout({
    preheader: 'Your organizer verification needs attention.',
    title: 'Verification needs attention',
    subtitle: `Hi ${payload.name ?? 'there'}, please review the details below.`,
    bodyHtml: `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151;">Your organizer verification was not approved this time.</p>
      ${payload.reason ? `<div style="margin:14px 0;padding:12px 14px;border:1px solid #fecaca;background:#fef2f2;border-radius:12px;color:#991b1b;font-size:14px;line-height:1.6;"><strong>Reason:</strong> ${payload.reason}</div>` : ''}
      <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;">Please resubmit clearer documents from your dashboard. Our team will review it again promptly.</p>
    `
  });

  await mailer.sendMail({
    from: env.SENDER_EMAIL,
    to: payload.email,
    subject: 'Your organizer verification needs attention',
    text: `Hi ${payload.name ?? 'there'},\n\nYour organizer verification was not approved.\n${payload.reason ? `Reason: ${payload.reason}\n` : ''}\nPlease resubmit clearer documents from your dashboard.\n`,
    html,
    attachments: [logoAttachment]
  });
};

export const sendSupportReplyEmail = async (payload: {
  to: string;
  requesterName?: string;
  subject: string;
  content: string;
  links: {
    am: string;
    om: string;
    en?: string;
  };
}) => {
  const linkButton = (label: string, href: string) => `
    <a href="${href}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#7f13ec;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;">${label}</a>
  `;

  const html = emailLayout({
    preheader: payload.subject,
    title: 'Support Team Reply',
    subtitle: `Hi ${payload.requesterName ?? 'there'}, we replied to your support request.`,
    bodyHtml: `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151;">${payload.content.replace(/\n/g, '<br/>')}</p>
      <div style="margin:16px 0;">
        <p style="margin:0 0 10px;font-size:13px;color:#6b7280;">Open this reply in your preferred language:</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;padding:8px;">
          ${linkButton('አማርኛ', payload.links.am)}
          ${linkButton('Afaan Oromic', payload.links.om)}
        </div>
      </div>
      <div style="margin:14px 0;padding:12px 14px;border:1px solid #ddd6fe;background:#f5f3ff;border-radius:12px;color:#4c1d95;font-size:13px;line-height:1.7;">
        If you need more help, you can reply to this email or open a new support request from our contact page.
      </div>
    `
  });

  await mailer.sendMail({
    from: env.SENDER_EMAIL,
    to: payload.to,
    subject: payload.subject,
    text: `${payload.content}\n\nAmharic: ${payload.links.am}\nOromic: ${payload.links.om}`,
    html,
    attachments: [logoAttachment]
  });
};
