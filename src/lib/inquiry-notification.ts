import nodemailer from "nodemailer";
import type { InquirySource } from "@prisma/client";

type InquiryNotificationData = {
  id: string;
  name: string;
  email: string;
  whatsapp?: string | null;
  brandName?: string | null;
  budget?: string | null;
  message?: string | null;
  source: InquirySource;
  serviceName?: string | null;
  recommendedServiceName?: string | null;
  createdAt: Date;
  adminUrl: string;
};

type InquiryNotificationContent = {
  subject: string;
  text: string;
  html: string;
};

const sourceLabels: Record<InquirySource, string> = {
  CONTACT_FORM: "Formulario de contacto",
  DIAGNOSTIC: "Diagnóstico",
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  OTHER: "Otro",
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const displayValue = (value?: string | null) => value?.trim() || "No informado";

export function buildInquiryNotification(
  inquiry: InquiryNotificationData,
): InquiryNotificationContent {
  const service =
    inquiry.serviceName ?? inquiry.recommendedServiceName ?? "No seleccionado";
  const receivedAt = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(inquiry.createdAt);

  const details = [
    ["Nombre", inquiry.name],
    ["Email", inquiry.email],
    ["WhatsApp", displayValue(inquiry.whatsapp)],
    ["Marca", displayValue(inquiry.brandName)],
    ["Servicio", service],
    ["Presupuesto", displayValue(inquiry.budget)],
    ["Origen", sourceLabels[inquiry.source]],
    ["Recibida", receivedAt],
  ];
  const safeSubjectName = inquiry.name.replace(/[\r\n]+/g, " ").trim();
  const subject = `Nueva consulta de ${safeSubjectName}`;
  const text = [
    "Recibiste una nueva consulta desde el sitio de Hello.",
    "",
    ...details.map(([label, value]) => `${label}: ${value}`),
    "",
    "Mensaje:",
    displayValue(inquiry.message),
    "",
    `Ver en el administrador: ${inquiry.adminUrl}`,
    `ID de la consulta: ${inquiry.id}`,
  ].join("\n");
  const detailRows = details
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 8px 16px 8px 0; color: #7e8ca4; vertical-align: top;">${escapeHtml(label)}</td>
          <td style="padding: 8px 0; color: #15171e; font-weight: 600;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
  const html = `
    <div style="margin: 0; padding: 32px; background: #f5f5fc; font-family: Arial, sans-serif;">
      <div style="max-width: 640px; margin: 0 auto; overflow: hidden; border: 1px solid #dfe5f0; border-radius: 20px; background: #ffffff;">
        <div style="padding: 28px 32px; background: #15171e; color: #ffffff;">
          <p style="margin: 0 0 12px; color: #00bbae; font-size: 13px; font-weight: 700;">HELLO.</p>
          <h1 style="margin: 0; font-size: 28px; line-height: 1.2;">Nueva consulta</h1>
        </div>
        <div style="padding: 28px 32px;">
          <p style="margin: 0 0 20px; color: #7e8ca4; line-height: 1.6;">
            ${escapeHtml(inquiry.name)} completó el formulario del sitio.
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tbody>${detailRows}</tbody>
          </table>
          <div style="margin-top: 24px; padding: 20px; border-radius: 14px; background: #f5f5fc;">
            <p style="margin: 0 0 8px; color: #6445df; font-size: 13px; font-weight: 700;">Mensaje</p>
            <p style="margin: 0; color: #15171e; line-height: 1.65; white-space: pre-wrap;">${escapeHtml(displayValue(inquiry.message))}</p>
          </div>
          <a href="${escapeHtml(inquiry.adminUrl)}" style="display: inline-block; margin-top: 24px; padding: 13px 20px; border-radius: 999px; background: #6445df; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none;">
            Ver consulta en el administrador
          </a>
        </div>
      </div>
    </div>`;

  return { subject, text, html };
}

export async function sendInquiryNotification(
  inquiry: InquiryNotificationData,
): Promise<{ sent: boolean; reason?: "missing_configuration" }> {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replaceAll(
    /\s/g,
    "",
  );
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || gmailUser;

  if (!gmailUser || !gmailAppPassword || !recipient) {
    return { sent: false, reason: "missing_configuration" };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
    connectionTimeout: 5_000,
    greetingTimeout: 5_000,
    socketTimeout: 10_000,
  });
  const content = buildInquiryNotification(inquiry);

  await transporter.sendMail({
    from: `Hello Agencia Creativa <${gmailUser}>`,
    to: recipient,
    replyTo: inquiry.email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  return { sent: true };
}
