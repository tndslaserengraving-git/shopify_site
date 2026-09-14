import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getProduct } from '@/lib/shopify';
import { isCustomizable } from '@/lib/customizable-products';
import ProductView from '@/components/shop/ProductView';

export const revalidate = 300;

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

      <ProductView
        images={images}
        variants={product.variants}
        options={product.options}
        title={product.title}
        descriptionHtml={product.descriptionHtml}
        requiresCustomization={requiresCustomization}
      />
    </div>
  );
}
