import GalleryGrid from '@/components/gallery/GalleryGrid';
import { galleryImages } from '@/config/gallery.config';

export default function GalleryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading font-bold text-navy text-4xl mb-2">Gallery</h1>
      <p className="font-body text-brand-text/60 mb-10">
        A look at some of our custom work.
      </p>
      <GalleryGrid images={galleryImages} />
    </div>
  );
}
