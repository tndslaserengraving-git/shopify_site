import { timingSafeEqual } from 'crypto';

export function validateAdminRequest(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  const provided = Buffer.from(authHeader.slice(7));
  const expected = Buffer.from(process.env.ADMIN_SECRET ?? '');
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}
