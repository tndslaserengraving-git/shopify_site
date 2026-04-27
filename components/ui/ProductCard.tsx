import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { EtsyListing } from '@/types/etsy';
import { formatPrice } from '@/lib/etsy';

interface Props {
  listing: EtsyListing;
}

export default function ProductCard({ listing }: Props) {
  const image = listing.images?.[0] ?? listing.primary_image;
  const price = formatPrice(listing.price);

  return (
    <div className="rounded-xl overflow-hidden backdrop-blur-sm bg-white/80 border border-white/20 shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col">
      {image ? (
        <div className="relative aspect-square">
          <Image
            src={image.url_570xN}
            alt={image.alt_text ?? listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="aspect-square bg-navy/10 flex items-center justify-center">
          <span className="font-body text-navy/30 text-sm">No image</span>
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-heading font-semibold text-brand-text text-sm line-clamp-2 flex-1">
          {listing.title}
        </h3>
        <p className="font-body font-bold text-navy text-base">{price}</p>
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-steel hover:text-navy text-xs font-body font-medium transition-colors cursor-pointer"
        >
          View on Etsy <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
