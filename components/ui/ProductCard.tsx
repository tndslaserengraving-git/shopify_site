import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { ShopifyProduct } from '@/types/shopify';
import { formatPrice } from '@/lib/shopify';

interface Props {
  product: ShopifyProduct;
}

const MATERIAL_TAGS: Record<string, string> = {
  wood: 'WOOD',
  slate: 'SLATE',
  glass: 'GLASS',
  metal: 'METAL',
  acrylic: 'ACRYLIC',
  granite: 'GRANITE',
};

function getMaterialTag(title: string): string | null {
  const lower = title.toLowerCase();
  for (const [key, val] of Object.entries(MATERIAL_TAGS)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

export default function ProductCard({ product }: Props) {
  const { amount, currencyCode } = product.priceRange.minVariantPrice;
  const price = formatPrice(amount, currencyCode);
  const materialTag = getMaterialTag(product.title);
  const image = product.featuredImage;

  return (
    <div
      className="product-card rounded-lg overflow-hidden flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(201,162,39,0.18)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Image */}
      <div className="relative aspect-square" style={{ background: '#111214' }}>
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(201,162,39,0.04) 10px, rgba(201,162,39,0.04) 11px)',
            }}
          >
            <span className="font-mono text-white/20" style={{ fontSize: 9 }}>[ no image ]</span>
          </div>
        )}

        {/* Material tag chip */}
        {materialTag && (
          <div
            className="absolute top-2.5 right-2.5"
            style={{
              background: 'rgba(201,162,39,0.12)',
              border: '1px solid rgba(201,162,39,0.3)',
              borderRadius: 3,
              padding: '2px 7px',
            }}
          >
            <span className="tac-label" style={{ fontSize: 8 }}>{materialTag}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3
          className="font-heading font-semibold text-brand-text flex-1 line-clamp-2 leading-snug"
          style={{ fontSize: 13 }}
        >
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-brand-text" style={{ fontSize: 16 }}>
            {price}
          </span>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body font-bold text-gold hover:text-gold-light transition-colors flex items-center gap-1 no-underline"
            style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            Shop <ExternalLink size={11} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
