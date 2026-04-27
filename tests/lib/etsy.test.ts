import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getActiveListings, getListing, getShopSections, formatPrice } from '@/lib/etsy';
import type { EtsyListing } from '@/types/etsy';

const mockListing: EtsyListing = {
  listing_id: 1,
  title: 'Custom Cutting Board',
  description: 'Laser engraved cutting board.',
  price: { amount: 4500, divisor: 100, currency_code: 'USD' },
  url: 'https://www.etsy.com/listing/1',
  state: 'active',
  quantity: 10,
  tags: ['custom', 'wood'],
  shop_section_id: null,
};

describe('getActiveListings', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.ETSY_API_KEY = 'test-key';
  });

  it('returns listings array on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ count: 1, results: [mockListing] }),
    });
    const listings = await getActiveListings('12345');
    expect(listings).toHaveLength(1);
    expect(listings[0].title).toBe('Custom Cutting Board');
  });

  it('sends correct x-api-key header', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ count: 0, results: [] }),
    });
    await getActiveListings('12345');
    expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(
      expect.stringContaining('/shops/12345/listings/active'),
      expect.objectContaining({ headers: { 'x-api-key': 'test-key' } })
    );
  });

  it('throws on API error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 403 });
    await expect(getActiveListings('12345')).rejects.toThrow('Etsy API error: 403');
  });
});

describe('formatPrice', () => {
  it('formats USD correctly', () => {
    expect(formatPrice({ amount: 4500, divisor: 100, currency_code: 'USD' })).toBe('$45.00');
  });

  it('formats cents correctly', () => {
    expect(formatPrice({ amount: 999, divisor: 100, currency_code: 'USD' })).toBe('$9.99');
  });
});
