import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getProduct } from '@/lib/shopify';
import { isCustomizable } from '@/lib/customizable-products';
import ImageViewer from '@/components/shop/ImageViewer';
import AddToCart from '@/components/shop/AddToCart';

export const revalidate = 3600;

interface Props {
  params: { handle: string };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = params;
  const product = await getProduct(handle).catch(() => null);
  if (!product) notFound();

  const images = product.images.length > 0 ? product.images : product.featuredImage ? [product.featuredImage] : [];
  const requiresCustomization = isCustomizable(product.title);

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

          {product.descriptionHtml && (
            <div
              className="font-body text-white/50 text-base leading-relaxed mb-8 prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}

          <AddToCart variants={product.variants} requiresCustomization={requiresCustomization} productTitle={product.title} />

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
    </div>
  );
}
