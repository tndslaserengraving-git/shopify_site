import type { EtsyListing, EtsyShopSection } from '@/types/etsy';
import { getActiveListings, getShopSections } from '@/lib/etsy';
import ProductGrid from '@/components/shop/ProductGrid';

export const revalidate = 3600;

export default async function ShopPage() {
  const shopId = process.env.ETSY_SHOP_ID!;
  let listings: EtsyListing[] = [];
  let sections: EtsyShopSection[] = [];

  try {
    [listings, sections] = await Promise.all([
      getActiveListings(shopId),
      getShopSections(shopId),
    ]);
  } catch (e) {
    console.error('[ShopPage] Etsy fetch failed:', e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading font-bold text-navy text-4xl mb-2">Shop</h1>
      <p className="font-body text-brand-text/60 mb-8">
        All products fulfilled through our{' '}
        <a
          href="https://www.etsy.com/shop/tndslaserengraving"
          target="_blank"
          rel="noopener noreferrer"
          className="text-steel hover:text-navy underline"
        >
          Etsy shop
        </a>
        .
      </p>
      <ProductGrid listings={listings} sections={sections} />
    </div>
  );
}
