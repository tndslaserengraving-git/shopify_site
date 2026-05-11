import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { Resend } from 'resend';
import { generateToken } from '@/lib/review-token';

const resend = new Resend(process.env.RESEND_API_KEY);

function verifyShopifyWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');
  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(signature);
  if (expectedBuf.length !== signatureBuf.length) return false;
  return timingSafeEqual(expectedBuf, signatureBuf);
}

function toHandle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-shopify-hmac-sha256') ?? '';
  const rawBody = await request.text();

  if (!verifyShopifyWebhook(rawBody, signature)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const order = JSON.parse(rawBody);
  const orderId = String(order.id);
  const email: string | undefined = order.email;
  const customerName: string = order.customer?.first_name ?? 'there';

  if (!email) return NextResponse.json({ ok: true });

  const lineItems: { title: string }[] = order.line_items ?? [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tndslaserengraving.com';

  for (const item of lineItems) {
    const productHandle = toHandle(item.title);
    const token = generateToken(orderId, productHandle, email);
    const reviewUrl = `${siteUrl}/reviews/${encodeURIComponent(token)}?order=${encodeURIComponent(orderId)}&product=${encodeURIComponent(productHandle)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(customerName)}`;

    try {
      await resend.emails.send({
        from: 'TNDS Laser Engraving <noreply@tndslaserengraving.com>',
        to: email,
        replyTo: 'tndslaserengraving@gmail.com',
        subject: `How was your ${item.title}? Share your experience`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 32px 24px;">
            <h2 style="margin: 0 0 16px; color: #111;">How did we do, ${customerName}?</h2>
            <p style="margin: 0 0 24px; line-height: 1.6;">
              Thank you for your recent order! We'd love to hear what you thought of your
              <strong>${item.title}</strong>.
            </p>
            <a
              href="${reviewUrl}"
              style="display: inline-block; background: #C9A227; color: #000; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; letter-spacing: 0.05em; font-size: 14px;"
            >
              LEAVE A REVIEW
            </a>
            <p style="margin: 24px 0 0; color: #999; font-size: 12px; line-height: 1.5;">
              This link is unique to your order and can only be used once.<br />
              — TNDS Laser Engraving
            </p>
          </div>
        `,
      });
    } catch (err) {
      console.error(`Failed to send review email for order ${orderId}, product ${productHandle}:`, err);
    }
  }

  return NextResponse.json({ ok: true });
}
