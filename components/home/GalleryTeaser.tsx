import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { galleryImages } from '@/config/gallery.config';

export default function GalleryTeaser() {
  const teaser = galleryImages.slice(0, 6);
  return (
    <section className="py-16 bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-bold text-white text-3xl">Our Work</h2>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 font-body text-sm font-medium text-steel hover:text-patriot-red transition-colors"
          >
            Full Gallery <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {teaser.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
