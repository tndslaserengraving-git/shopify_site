import { getProducts } from '@/lib/shopify';
import GalleryGrid from '@/components/gallery/GalleryGrid';

export const revalidate = 3600;

export default async function GalleryPage() {
  let images: { id: string; handle: string; url: string; alt: string }[] = [];

  try {
    const products = await getProducts();
    images = products
      .filter((p) => p.featuredImage)
      .map((p) => ({
        id: p.id,
        handle: p.handle,
        url: p.featuredImage!.url,
        alt: p.featuredImage!.altText ?? p.title,
      }));
  } catch {
    // show empty state below
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="section-rule" />
      <span className="tac-label">Portfolio</span>
      <h1
        className="font-heading font-black text-brand-text mt-2 mb-2"
        style={{ fontSize: 'clamp(30px, 4vw, 44px)', letterSpacing: '-0.02em' }}
      >
        Our Work
      </h1>
      <p className="font-body text-white/45 mb-10">
        A look at some of our custom laser engraving work.
      </p>
      {images.length > 0 ? (
        <GalleryGrid images={images} />
      ) : (
        <p className="font-body text-white/30 text-center py-20">No gallery images available.</p>
      )}
    </div>
  );
}
