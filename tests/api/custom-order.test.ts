import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('resend', () => {
  const sendMock = vi.fn().mockResolvedValue({ id: 'email-123' });
  class Resend {
    emails = { send: sendMock };
    constructor(_key?: string) {}
  }
  return { Resend };
});

const makeFormData = (fields: Record<string, string>) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  return fd;
};

describe('POST /api/custom-order', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.OWNER_EMAIL = 'owner@test.com';
  });

  it('returns 200 on valid submission', async () => {
    const { POST } = await import('@/app/api/custom-order/route');
    const fd = makeFormData({
      name: 'John Doe',
      email: 'john@example.com',
      productType: 'cutting-board',
      engraveText: 'The Doe Family',
      size: '12x18"',
      quantity: '1',
      designStyle: 'text',
      notes: '',
      phone: '',
      contactMethod: 'email',
    });
    const req = new Request('http://localhost/api/custom-order', {
      method: 'POST',
      body: fd,
    });
    const res = await POST(req as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('returns 400 when name is missing', async () => {
    const { POST } = await import('@/app/api/custom-order/route');
    const fd = makeFormData({ email: 'john@example.com', productType: 'cutting-board' });
    const req = new Request('http://localhost/api/custom-order', { method: 'POST', body: fd });
    const res = await POST(req as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(400);
  });

  it('returns 400 when email is missing', async () => {
    const { POST } = await import('@/app/api/custom-order/route');
    const fd = makeFormData({ name: 'John', productType: 'cutting-board' });
    const req = new Request('http://localhost/api/custom-order', { method: 'POST', body: fd });
    const res = await POST(req as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(400);
  });
});
