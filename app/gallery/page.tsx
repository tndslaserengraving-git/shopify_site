import { supabaseAdmin } from '@/lib/supabase-admin';
import { getProducts } from '@/lib/shopify';
import GalleryGrid from '@/components/gallery/GalleryGrid';

export const revalidate = 60;

export default async function GalleryPage() {
  type GalleryImage = { id: string; url: string; alt: string; caption: string | null };

  // Curated uploads (admin-managed, shown first)
  let curatedImages: GalleryImage[] = [];
  try {
    const { data } = await supabaseAdmin
      .from('gallery_images')
      .select('id, public_url, alt_text, caption')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (data) {
      curatedImages = data.map((row) => ({
        id: row.id,
        url: row.public_url,
        alt: row.alt_text || 'Custom laser engraving work',
        caption: row.caption ?? null,
      }));
    }
  } catch {
    // fall through to Shopify images only
  }

  // Product images pulled directly from Shopify (no links)
  let shopifyImages: GalleryImage[] = [];
  try {
    const products = await getProducts();
    shopifyImages = products
      .filter((p) => p.featuredImage)
      .map((p) => ({
        id: `shopify-${p.id}`,
        url: p.featuredImage!.url,
        alt: p.featuredImage!.altText ?? p.title,
        caption: null,
      }));
  } catch {
    // fall through with whatever we have
  }

  const images = [...curatedImages, ...shopifyImages];

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
