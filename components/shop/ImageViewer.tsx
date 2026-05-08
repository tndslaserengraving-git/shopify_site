'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageItem {
  url: string;
  altText: string | null;
}

interface Props {
  images: ImageItem[];
  title: string;
}

export default function ImageViewer({ images, title }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-white/5 rounded-xl flex items-center justify-center">
        <span className="font-body text-white/30">No image</span>
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative aspect-square rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(201,162,39,0.18)' }}
      >
        <Image
          src={images[active].url}
          alt={images[active].altText ?? title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden focus:outline-none"
              style={{
                border: i === active
                  ? '2px solid rgba(201,162,39,0.8)'
                  : '1px solid rgba(201,162,39,0.15)',
              }}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? title}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
