import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/shopify';

export default async function GalleryTeaser() {
  let images: { id: string; url: string; alt: string }[] = [];

  try {
    const products = await getProducts();
    images = products
      .filter((p) => p.featuredImage)
      .slice(0, 6)
      .map((p) => ({
        id: p.id,
        url: p.featuredImage!.url,
        alt: p.featuredImage!.altText ?? p.title,
      }));
  } catch {
    // gallery hidden if fetch fails
  }

  if (images.length === 0) return null;

  return (
    <section className="py-20" style={{ background: '#0A0A0B' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-rule" />
            <span className="tac-label">Gallery</span>
            <h2
              className="font-heading font-black text-brand-text mt-2"
              style={{ fontSize: 'clamp(24px, 3vw, 34px)', letterSpacing: '-0.01em' }}
            >
              Our Work
            </h2>
          </div>
          <Link
            href="/gallery"
            className="font-body font-bold text-gold hover:text-gold-light transition-colors flex items-center gap-1.5 no-underline"
            style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Full Gallery <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="gallery-img-wrap relative rounded-md overflow-hidden cursor-pointer"
              style={{
                aspectRatio: '1',
                border: '1px solid rgba(201,162,39,0.15)',
                background: '#111214',
              }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div
                className="gallery-overlay absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(10,10,11,0.55)' }}
              >
                <span className="tac-label" style={{ color: '#EDD56A' }}>View</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
