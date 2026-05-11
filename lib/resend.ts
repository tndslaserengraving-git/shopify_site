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

export async function sendReviewNotificationEmail(review: {
  id: string;
  author_name: string;
  product_handle: string;
  rating: number;
  body: string;
  verified_purchase: boolean;
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tndslaserengraving.com';
  const token = encodeURIComponent(process.env.ADMIN_SECRET ?? '');
  const base = `${siteUrl}/api/admin/reviews/${review.id}?token=${token}`;
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const verified = review.verified_purchase
    ? ' <span style="color:#16a34a;font-weight:600">(Verified Purchase)</span>'
    : '';

  const html = `
    <h2 style="color:#1B2E4B;font-family:sans-serif">New Review Submitted</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;font-weight:600">Product:</td><td>${esc(review.product_handle)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:600">Author:</td><td>${esc(review.author_name)}${verified}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:600">Rating:</td><td style="font-size:18px;color:#C9A227">${stars}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;vertical-align:top">Review:</td><td>${esc(review.body)}</td></tr>
    </table>
    <p style="margin-top:24px;font-family:sans-serif">
      <a href="${base}&action=approve" style="background:#16a34a;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;margin-right:12px;font-size:14px">Approve</a>
      <a href="${base}&action=reject" style="background:#dc2626;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;font-size:14px">Reject</a>
    </p>
  `;

  await resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
    to: process.env.OWNER_EMAIL!,
    subject: `New Review — ${review.product_handle} — ${review.author_name}`,
    html,
  });
}
