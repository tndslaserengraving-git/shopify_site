import Image from 'next/image';

interface Props {
  images: { id: string; url: string; alt: string; caption?: string | null }[];
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
          className="relative break-inside-avoid rounded-md overflow-hidden block"
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
          {img.caption && (
            <div
              className="px-3 py-2"
              style={{ background: 'rgba(10,10,11,0.85)' }}
            >
              <p className="font-body text-white/50 text-xs">{img.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
