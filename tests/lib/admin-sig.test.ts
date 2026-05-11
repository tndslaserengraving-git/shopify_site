import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateAdminRequest } from '@/lib/admin-sig';

describe('validateAdminRequest', () => {
  beforeEach(() => vi.stubEnv('ADMIN_SECRET', 'test-secret'));
  afterEach(() => vi.unstubAllEnvs());

  it('returns true for correct Bearer secret', () => {
    const req = new Request('http://localhost', {
      headers: { Authorization: 'Bearer test-secret' },
    });
    expect(validateAdminRequest(req)).toBe(true);
  });

  it('returns false for wrong secret', () => {
    const req = new Request('http://localhost', {
      headers: { Authorization: 'Bearer wrong' },
    });
    expect(validateAdminRequest(req)).toBe(false);
  });

  it('returns false when Authorization header is missing', () => {
    const req = new Request('http://localhost');
    expect(validateAdminRequest(req)).toBe(false);
  });

  it('returns false when header lacks Bearer prefix', () => {
    const req = new Request('http://localhost', {
      headers: { Authorization: 'test-secret' },
    });
    expect(validateAdminRequest(req)).toBe(false);
  });

  it('returns false when ADMIN_SECRET is not configured', () => {
    vi.unstubAllEnvs();
    const req = new Request('http://localhost', {
      headers: { Authorization: 'Bearer test-secret' },
    });
    expect(validateAdminRequest(req)).toBe(false);
  });
});
