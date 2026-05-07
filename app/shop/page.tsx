import { getProducts, getCollections } from '@/lib/shopify';
import type { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import ProductGrid from '@/components/shop/ProductGrid';

export const revalidate = 3600;

export default async function ShopPage() {
  let products: ShopifyProduct[] = [];
  let collections: ShopifyCollection[] = [];

  try {
    [products, collections] = await Promise.all([
      getProducts(),
      getCollections(),
    ]);
  } catch (e) {
    console.error('[ShopPage] Shopify fetch failed:', e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="section-rule" />
      <span className="tac-label">All Products</span>
      <h1
        className="font-heading font-black text-brand-text mt-2 mb-2"
        style={{ fontSize: 'clamp(30px, 4vw, 44px)', letterSpacing: '-0.02em' }}
      >
        Shop
      </h1>
      <p className="font-body text-white/45 mb-10">
        Handcrafted laser-engraved products, made to order.
      </p>
      <ProductGrid products={products} collections={collections} />
    </div>
  );
}
