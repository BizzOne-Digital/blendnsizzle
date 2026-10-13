import "server-only";
import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  console.log("[email] sendContactNotification called", {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUserSet: Boolean(process.env.SMTP_USER),
    smtpPassSet: Boolean(process.env.SMTP_PASS),
  });

  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] SMTP not configured (missing SMTP_USER/SMTP_PASS) — skipping notification email");
    return;
  }

  const to = process.env.SMTP_USER;

  try {
    const info = await transporter.sendMail({
      from: `"Blend N Sizzle Website" <${process.env.SMTP_USER}>`,
      to,
      replyTo: data.email,
      subject: `New Contact Form Submission: ${data.subject}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.phone ? `Phone: ${data.phone}` : null,
        `Subject: ${data.subject}`,
        "",
        data.message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    console.log("[email] Contact notification sent successfully", { messageId: info.messageId, to });
  } catch (error) {
    console.error("[email] Failed to send contact notification email:", error);
  }
}
