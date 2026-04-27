import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { getListing, getListingImages, formatPrice } from '@/lib/etsy';
import type { EtsyListing, EtsyListingImage } from '@/types/etsy';

export const revalidate = 3600;

interface Props {
  params: Promise<{ listingId: string }>;
}

export default async function ListingPage({ params }: Props) {
  const { listingId } = await params;

  let listing: EtsyListing | undefined;
  let images: EtsyListingImage[] | undefined;
  try {
    [listing, images] = await Promise.all([
      getListing(listingId),
      getListingImages(listingId),
    ]);
  } catch {
    notFound();
  }

  if (!listing || !images) notFound();

  if (listing.state !== 'active') notFound();

  const primaryImage = images[0];
  const price = formatPrice(listing.price);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 font-body text-sm text-steel hover:text-navy transition-colors mb-8"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          {primaryImage ? (
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src={primaryImage.url_fullxfull}
                alt={primaryImage.alt_text ?? listing.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="aspect-square bg-navy/10 rounded-xl flex items-center justify-center">
              <span className="font-body text-navy/30">No image</span>
            </div>
          )}

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.slice(1).map((img) => (
                <div
                  key={img.listing_image_id}
                  className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden"
                >
                  <Image
                    src={img.url_170x135}
                    alt={img.alt_text ?? listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-heading font-bold text-navy text-2xl sm:text-3xl mb-3">
            {listing.title}
          </h1>
          <p className="font-body font-bold text-2xl text-patriot-red mb-6">{price}</p>

          <p className="font-body text-brand-text/75 text-base leading-relaxed mb-8 whitespace-pre-line">
            {listing.description}
          </p>

          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-patriot-red hover:bg-patriot-red-dark text-white font-body font-semibold px-6 py-3 rounded-md transition-colors duration-150 cursor-pointer mb-4"
          >
            Buy on Etsy <ExternalLink size={16} aria-hidden="true" />
          </a>

          <div className="mt-4">
            <Link
              href="/custom-order"
              className="font-body text-sm text-steel hover:text-navy underline"
            >
              Need something custom? Start an order →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
