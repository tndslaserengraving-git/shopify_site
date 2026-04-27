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

export async function sendOrderEmail(data: OrderData): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const rows = [
    ['Product Type', data.productType],
    ['Text to Engrave', data.engraveText],
    ['Size', data.size],
    ['Quantity', String(data.quantity)],
    ['Material', data.material || 'Not specified'],
    ['Design Style', data.designStyle],
    ['Notes', data.notes || 'None'],
    ['Phone', data.phone || 'Not provided'],
    ['Preferred Contact', data.contactMethod],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${k}:</td><td>${v}</td></tr>`)
    .join('');

  const html = `
    <h2 style="color:#1B2E4B">New Custom Order from ${data.name}</h2>
    <p><strong>Reply to:</strong> ${data.email}</p>
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
    from: 'onboarding@resend.dev',
    to: process.env.OWNER_EMAIL!,
    replyTo: data.email,
    subject: `New Custom Order — ${data.productType} — ${data.name}`,
    html,
    attachments,
  });
}
