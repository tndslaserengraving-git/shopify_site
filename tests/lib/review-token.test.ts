import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateToken, verifyToken } from '@/lib/review-token';

describe('review token', () => {
  beforeEach(() => vi.stubEnv('REVIEW_HMAC_SECRET', 'test-hmac-secret'));
  afterEach(() => vi.unstubAllEnvs());

  it('generates a 64-char hex string', () => {
    const token = generateToken('order1', 'board', 'a@b.com');
    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });

  it('same inputs always produce same token', () => {
    const t1 = generateToken('order1', 'board', 'a@b.com');
    const t2 = generateToken('order1', 'board', 'a@b.com');
    expect(t1).toBe(t2);
  });

  it('different order ID produces different token', () => {
    const t1 = generateToken('order1', 'board', 'a@b.com');
    const t2 = generateToken('order2', 'board', 'a@b.com');
    expect(t1).not.toBe(t2);
  });

  it('verifies a valid token', () => {
    const token = generateToken('order1', 'board', 'a@b.com');
    expect(verifyToken(token, 'order1', 'board', 'a@b.com')).toBe(true);
  });

  it('rejects tampered token', () => {
    expect(verifyToken('a'.repeat(64), 'order1', 'board', 'a@b.com')).toBe(false);
  });

  it('rejects when order ID differs', () => {
    const token = generateToken('order1', 'board', 'a@b.com');
    expect(verifyToken(token, 'order2', 'board', 'a@b.com')).toBe(false);
  });

  it('returns false for invalid hex without throwing', () => {
    expect(verifyToken('not-hex!!', 'order1', 'board', 'a@b.com')).toBe(false);
  });
});
