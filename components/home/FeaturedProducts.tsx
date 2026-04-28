import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { getActiveListings } from '@/lib/etsy';

export default async function FeaturedProducts() {
  let listings: Awaited<ReturnType<typeof getActiveListings>> = [];

  try {
    const shopId = process.env.ETSY_SHOP_ID;
    if (!shopId) return null;
    const all = await getActiveListings(shopId);
    listings = all.slice(0, 4);
  } catch {
    return null;
  }

  if (listings.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading font-bold text-white text-3xl">Featured Products</h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 font-body text-sm font-medium text-steel hover:text-patriot-red transition-colors"
        >
          See All <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ProductCard key={listing.listing_id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
