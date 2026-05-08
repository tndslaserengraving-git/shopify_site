import Image from 'next/image';
import Link from 'next/link';

interface Props {
  images: { id: string; handle: string; url: string; alt: string }[];
}

export default function GalleryGrid({ images }: Props) {
  return (
    <div
      className="columns-2 md:columns-3 gap-3 space-y-3"
      role="list"
      aria-label="Gallery of laser engraving work"
    >
      {images.map((img) => (
        <Link
          key={img.id}
          href={`/shop/${img.handle}`}
          className="gallery-img-wrap relative break-inside-avoid rounded-md overflow-hidden block no-underline"
          role="listitem"
          style={{ border: '1px solid rgba(201,162,39,0.15)' }}
        >
          <Image
            src={img.url}
            alt={img.alt}
            width={600}
            height={600}
            className="w-full h-auto object-cover"
          />
          <div
            className="gallery-overlay absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(10,10,11,0.5)' }}
          >
            <span className="tac-label" style={{ color: '#EDD56A' }}>View</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
