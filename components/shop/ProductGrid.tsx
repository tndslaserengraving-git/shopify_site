'use client';
import { useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { orderProducts } from '@/lib/product-order';
import type { ShopifyProduct, ShopifyCollection } from '@/types/shopify';

interface Props {
  products: ShopifyProduct[];
  collections: ShopifyCollection[];
}

export default function ProductGrid({ products, collections }: Props) {
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const ordered = orderProducts(products);

  const filtered =
    activeCollection === null
      ? ordered
      : ordered.filter((p) => p.collections.some((c) => c.id === activeCollection));

  return (
    <div>
      {collections.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCollection(null)}
            className="font-body font-semibold text-xs px-4 py-2 rounded-sm transition-all duration-150 cursor-pointer"
            style={
              activeCollection === null
                ? {
                    background: 'linear-gradient(135deg, #8B6914, #C9A227 40%, #EDD56A 55%, #C9A227 70%, #8B6914)',
                    color: '#0A0A0B',
                    border: '1px solid transparent',
                    letterSpacing: '0.06em',
                  }
                : {
                    background: 'transparent',
                    color: 'rgba(237,235,230,0.45)',
                    border: '1px solid rgba(201,162,39,0.2)',
                    letterSpacing: '0.06em',
                  }
            }
          >
            ALL
          </button>
          {collections.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCollection(c.id)}
              className="font-body font-semibold text-xs px-4 py-2 rounded-sm transition-all duration-150 cursor-pointer"
              style={
                activeCollection === c.id
                  ? {
                      background: 'linear-gradient(135deg, #8B6914, #C9A227 40%, #EDD56A 55%, #C9A227 70%, #8B6914)',
                      color: '#0A0A0B',
                      border: '1px solid transparent',
                      letterSpacing: '0.06em',
                    }
                  : {
                      background: 'transparent',
                      color: 'rgba(237,235,230,0.45)',
                      border: '1px solid rgba(201,162,39,0.2)',
                      letterSpacing: '0.06em',
                    }
              }
            >
              {c.title.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="font-body text-white/30 text-center py-20">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
