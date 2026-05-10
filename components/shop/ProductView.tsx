'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import ImageViewer from './ImageViewer';
import AddToCart from './AddToCart';
import type { ShopifyVariant } from '@/lib/shopify';

interface ImageItem {
  url: string;
  altText: string | null;
}

interface Props {
  images: ImageItem[];
  variants: ShopifyVariant[];
  title: string;
  descriptionHtml?: string;
  requiresCustomization?: boolean;
}

export default function ProductView({ images, variants, title, descriptionHtml, requiresCustomization }: Props) {
  const available = variants.filter((v) => v.availableForSale);
  const [selectedId, setSelectedId] = useState(available[0]?.id ?? variants[0]?.id ?? '');
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedVariant = variants.find((v) => v.id === selectedId);

  const displayImages = (() => {
    const vi = selectedVariant?.image;
    if (!vi?.url) return images;
    const idx = images.findIndex((img) => img.url === vi.url);
    if (idx === 0) return images;
    if (idx > 0) return [images[idx], ...images.slice(0, idx), ...images.slice(idx + 1)];
    return [vi, ...images];
  })();

  const handleSelectVariant = useCallback((id: string) => {
    setSelectedId(id);
    setActiveIndex(0);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <ImageViewer
          images={displayImages}
          title={title}
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
        />
      </div>

      <div>
        <div className="section-rule" />
        <span className="tac-label">Product</span>
        <h1
          className="font-heading font-black text-brand-text mt-2 mb-3"
          style={{ fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.02em' }}
        >
          {title}
        </h1>

        {descriptionHtml && (
          <div
            className="font-body text-white/50 text-base leading-relaxed mb-8 prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}

        <AddToCart
          variants={variants}
          requiresCustomization={requiresCustomization}
          productTitle={title}
          selectedId={selectedId}
          onSelectId={handleSelectVariant}
        />

        <p className="font-body text-white/30 text-sm mt-6">
          Need something custom?{' '}
          <Link href="/custom-order" className="underline hover:text-white/60 transition-colors">
            Start a custom order
          </Link>{' '}
          or{' '}
          <Link href="/contact" className="underline hover:text-white/60 transition-colors">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
