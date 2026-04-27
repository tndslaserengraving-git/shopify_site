import { Resend } from 'resend';

export interface OrderData {
  name: string;
  email: string;
  productType: string;
  engraveText: string;
  size: string;
  quantity: number;
  material: string;
  designStyle: string;
  notes: string;
  phone: string;
  contactMethod: string;
  referenceImage: File | null;
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function sendOrderEmail(data: OrderData): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const rows = [
    ['Product Type', esc(data.productType)],
    ['Text to Engrave', esc(data.engraveText)],
    ['Size', esc(data.size)],
    ['Quantity', String(data.quantity)],
    ['Material', esc(data.material || 'Not specified')],
    ['Design Style', esc(data.designStyle)],
    ['Notes', esc(data.notes || 'None')],
    ['Phone', esc(data.phone || 'Not provided')],
    ['Preferred Contact', esc(data.contactMethod)],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${k}:</td><td>${v}</td></tr>`)
    .join('');

  const html = `
    <h2 style="color:#1B2E4B">New Custom Order from ${esc(data.name)}</h2>
    <p><strong>Reply to:</strong> ${esc(data.email)}</p>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows}
    </table>
  `;

  const attachments: { filename: string; content: Buffer }[] = [];
  if (data.referenceImage) {
    const buffer = await data.referenceImage.arrayBuffer();
    attachments.push({ filename: data.referenceImage.name, content: Buffer.from(buffer) });
  }

  await resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
    to: process.env.OWNER_EMAIL!,
    replyTo: data.email,
    subject: `New Custom Order — ${data.productType} — ${data.name}`,
    html,
    attachments,
  });
}
