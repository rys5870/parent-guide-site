import nodemailer from "nodemailer";

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.NEWSLETTER_FROM_EMAIL
  );
}

export function createMailerTransport() {
  if (!isSmtpConfigured()) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export function newsletterFromHeader(): string {
  const name = process.env.NEWSLETTER_FROM_NAME ?? "מנחת הורים";
  const email = process.env.NEWSLETTER_FROM_EMAIL!;
  return `"${name.replace(/"/g, "")}" <${email}>`;
}

export async function sendNewsletterMessage(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const transport = createMailerTransport();
  if (!transport) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }
  await transport.sendMail({
    from: newsletterFromHeader(),
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
}
