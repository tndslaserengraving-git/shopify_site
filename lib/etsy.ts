import type {
  EtsyListing,
  EtsyListingImage,
  EtsyListingsResponse,
  EtsyShopSection,
  EtsySectionsResponse,
  EtsyPrice,
} from '@/types/etsy';

const ETSY_BASE = 'https://openapi.etsy.com/v3/application';

async function etsyFetch<T>(path: string, revalidate = 3600): Promise<T> {
  const res = await fetch(`${ETSY_BASE}${path}`, {
    headers: { 'x-api-key': process.env.ETSY_API_KEY! },
    next: { revalidate },
  } as RequestInit);
  if (!res.ok) throw new Error(`Etsy API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getActiveListings(shopId: string): Promise<EtsyListing[]> {
  const data = await etsyFetch<EtsyListingsResponse>(
    `/shops/${shopId}/listings/active?limit=100`
  );
  return data.results;
}

export async function getListing(listingId: string): Promise<EtsyListing> {
  return etsyFetch<EtsyListing>(`/listings/${listingId}`);
}

export async function getListingImages(listingId: string): Promise<EtsyListingImage[]> {
  const data = await etsyFetch<{ results: EtsyListingImage[] }>(
    `/listings/${listingId}/images`
  );
  return data.results;
}

export async function getShopSections(shopId: string): Promise<EtsyShopSection[]> {
  const data = await etsyFetch<EtsySectionsResponse>(
    `/shops/${shopId}/sections`,
    86400
  );
  return data.results;
}

export function formatPrice(price: EtsyPrice): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency_code,
  }).format(price.amount / price.divisor);
}
