import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getProduct, formatPrice } from '@/lib/shopify';
import ImageViewer from '@/components/shop/ImageViewer';

export const revalidate = 3600;

interface Props {
  params: { handle: string };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = params;
  const product = await getProduct(handle).catch(() => null);
  if (!product) notFound();

  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode,
  );

  const images = product.images.length > 0 ? product.images : product.featuredImage ? [product.featuredImage] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 font-body text-sm text-white/40 hover:text-white/80 transition-colors mb-8"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <ImageViewer images={images} title={product.title} />
        </div>

        <div>
          <div className="section-rule" />
          <span className="tac-label">Product</span>
          <h1
            className="font-heading font-black text-brand-text mt-2 mb-3"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.02em' }}
          >
            {product.title}
          </h1>

          <p className="font-body font-bold text-2xl mb-6" style={{ color: '#C9A227' }}>
            {price}
          </p>

          {product.descriptionHtml && (
            <div
              className="font-body text-white/50 text-base leading-relaxed mb-8 prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}

          <Link href="/custom-order" className="btn-gold mb-4 inline-flex">
            Start Custom Order <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <p className="font-body text-white/30 text-sm mt-4">
            Want this exact item?{' '}
            <Link href="/contact" className="underline hover:text-white/60 transition-colors">
              Contact us
            </Link>{' '}
            and we&apos;ll get you sorted.
          </p>
        </div>
      </div>
    </div>
  );
}
