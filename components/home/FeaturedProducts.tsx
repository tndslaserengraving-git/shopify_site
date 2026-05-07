import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { getProducts } from '@/lib/shopify';

export default async function FeaturedProducts() {
  let featured: Awaited<ReturnType<typeof getProducts>> = [];

  try {
    const all = await getProducts();
    featured = all.slice(0, 4);
  } catch {
    return null;
  }

  if (featured.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="section-rule" />
          <span className="tac-label">Shop</span>
          <h2
            className="font-heading font-black text-brand-text mt-2"
            style={{ fontSize: 'clamp(24px, 3vw, 34px)', letterSpacing: '-0.01em' }}
          >
            Featured Products
          </h2>
        </div>
        <Link
          href="/shop"
          className="font-body font-bold text-gold hover:text-gold-light transition-colors flex items-center gap-1.5 no-underline"
          style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          See All <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
