import { createHmac, timingSafeEqual } from 'crypto';

export function generateToken(orderId: string, productHandle: string, email: string): string {
  return createHmac('sha256', process.env.REVIEW_HMAC_SECRET!)
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
