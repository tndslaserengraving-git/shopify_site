import { timingSafeEqual } from 'crypto';

export function validateAdminRequest(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  const provided = Buffer.from(authHeader.slice(7));
  const expected = Buffer.from(secret);
  const dummy = Buffer.alloc(expected.length);
  const candidate = provided.length === expected.length ? provided : dummy;
  return provided.length === expected.length && timingSafeEqual(candidate, expected);
}
