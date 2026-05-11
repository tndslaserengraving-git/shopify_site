import { createHmac, timingSafeEqual } from 'crypto';

export function generateToken(orderId: string, productHandle: string, email: string): string {
  const secret = process.env.REVIEW_HMAC_SECRET;
  if (!secret) throw new Error('REVIEW_HMAC_SECRET environment variable is required');
  return createHmac('sha256', secret)
    .update(`${orderId}:${productHandle}:${email}`)
    .digest('hex');
}

export function verifyToken(
  token: string,
  orderId: string,
  productHandle: string,
  email: string,
): boolean {
  try {
    const expected = generateToken(orderId, productHandle, email);
    return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}
