import Image from 'next/image';
import type { GalleryImage } from '@/config/gallery.config';

interface Props {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: Props) {
  return (
    <div
      className="columns-2 md:columns-3 gap-3 space-y-3"
      role="list"
      aria-label="Gallery of laser engraving work"
    >
      {images.map((img) => (
        <div
          key={img.id}
          className="relative break-inside-avoid rounded-lg overflow-hidden"
          role="listitem"
        >
          <Image
            src={img.url}
            alt={img.alt}
            width={600}
            height={600}
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}
