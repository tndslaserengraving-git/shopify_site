'use client';
import { useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import type { EtsyListing, EtsyShopSection } from '@/types/etsy';

interface Props {
  listings: EtsyListing[];
  sections: EtsyShopSection[];
}

export default function ProductGrid({ listings, sections }: Props) {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const filtered =
    activeSection === null
      ? listings
      : listings.filter((l) => l.shop_section_id === activeSection);

  return (
    <div>
      {sections.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveSection(null)}
            className={`font-body text-sm px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
              activeSection === null
                ? 'bg-navy text-white border-navy'
                : 'border-navy/30 text-navy/70 hover:border-navy hover:text-navy'
            }`}
          >
            All
          </button>
          {sections.map((s) => (
            <button
              key={s.shop_section_id}
              onClick={() => setActiveSection(s.shop_section_id)}
              className={`font-body text-sm px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
                activeSection === s.shop_section_id
                  ? 'bg-navy text-white border-navy'
                  : 'border-navy/30 text-navy/70 hover:border-navy hover:text-navy'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="font-body text-brand-text/50 text-center py-16">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((listing) => (
            <ProductCard key={listing.listing_id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
