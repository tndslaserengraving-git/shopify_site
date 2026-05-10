import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield } from 'lucide-react';
import { getProducts } from '@/lib/shopify';

const STAR = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const PRODUCT_TILES = [
  { label: 'Cutting Board', tag: 'WOOD', keywords: ['cutting board', 'grill master', 'bbq board'] },
  { label: 'Metal Engraving', tag: 'METAL', keywords: ['stainless steel pet', 'pet id tag'] },
  { label: 'Business Cards', tag: 'METAL', keywords: ['business card'] },
  { label: 'Slate Coasters', tag: 'SLATE', keywords: ['slate zodiac', 'zodiac coaster', 'slate coaster'] },
];

export default async function Hero() {
  const products = await getProducts().catch(() => []);

  const usedIds = new Set<string>();

  const tiles = PRODUCT_TILES.map((tile, i) => {
    const lower = (s: string) => s.toLowerCase();
    let match = products.find(
      (p) => !usedIds.has(p.id) && tile.keywords.some((kw) => lower(p.title).includes(kw))
    );
    // fallback: pick the i-th unused product so tiles are never empty
    if (!match) match = products.filter((p) => !usedIds.has(p.id))[0];
    if (match) usedIds.add(match.id);
    return { ...tile, image: match?.featuredImage ?? null, url: match?.url ?? '/shop' };
  });

  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: '90svh', background: '#0A0A0B' }}
      aria-label="Hero"
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.07,
          backgroundImage: 'radial-gradient(circle, rgba(201,162,39,0.8) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 60% 50%, transparent 30%, rgba(10,10,11,0.85) 100%)' }}
        aria-hidden="true"
      />
      {/* Gold glow top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -120, right: -80, width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,162,39,0.07) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* ── Left: Copy ── */}
          <div>
            {/* Veteran label */}
            <div className="flex items-center gap-2 mb-6" style={{ color: '#C9A227' }}>
              {STAR}
              <span className="tac-label">Veteran-Owned &amp; Operated</span>
              {STAR}
            </div>

            {/* Headline */}
            <h1
              className="font-heading font-black text-brand-text leading-none mb-6"
              style={{ fontSize: 'clamp(44px, 6vw, 80px)', letterSpacing: '-0.02em' }}
            >
              Precision<br />
              Crafted.<br />
              <span className="gold-shimmer">Veteran Built.</span>
            </h1>

            <p className="font-body text-white/60 text-lg max-w-xl mb-9 leading-relaxed">
              Custom laser engraving on wood, slate, acrylic, glass, and metal.
              Every piece made with military precision and American pride.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/custom-order" className="btn-gold">
                Start Custom Order <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/shop" className="btn-outline">
                Browse Products
              </Link>
            </div>

            {/* Inline trust signals */}
            <div
              className="flex flex-wrap items-center gap-5 pt-6"
              style={{ borderTop: '1px solid rgba(237,235,230,0.08)' }}
            >
              <div className="flex items-center gap-2" style={{ color: '#C9A227' }}>
                <Shield size={14} aria-hidden="true" />
                <span className="font-body font-semibold text-white/50 text-xs">U.S. Military Veteran</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <span className="font-body font-semibold text-white/50 text-xs">24–48h Turnaround</span>
              <div className="w-px h-4 bg-white/10" />
              <span className="font-body font-semibold text-white/50 text-xs">Satisfaction Guaranteed</span>
            </div>
          </div>

          {/* ── Right: Product grid ── */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {tiles.map((tile) => (
              <Link
                key={tile.tag}
                href={tile.url}
                className="bracket-box relative overflow-hidden flex flex-col justify-end no-underline"
                style={{
                  aspectRatio: '1',
                  background: '#111214',
                  border: '1px solid rgba(201,162,39,0.18)',
                  borderRadius: 6,
                }}
              >
                {tile.image ? (
                  <Image
                    src={tile.image.url}
                    alt={tile.image.altText ?? tile.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 0vw, 20vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(201,162,39,0.04) 8px, rgba(201,162,39,0.04) 9px)',
                    }}
                  >
                    <span className="font-mono text-white/20" style={{ fontSize: 9 }}>[ product photo ]</span>
                    <span className="font-mono text-white/15" style={{ fontSize: 8 }}>{tile.label}</span>
                  </div>
                )}

                {/* Label row */}
                <div
                  className="relative flex items-end justify-between px-3 py-2"
                  style={{ background: 'linear-gradient(transparent, rgba(10,10,11,0.95))' }}
                >
                  <span className="font-body font-semibold text-brand-text" style={{ fontSize: 11 }}>
                    {tile.label}
                  </span>
                  <span
                    className="tac-label"
                    style={{
                      fontSize: 8,
                      background: 'rgba(201,162,39,0.12)',
                      border: '1px solid rgba(201,162,39,0.25)',
                      padding: '2px 6px',
                      borderRadius: 2,
                    }}
                  >
                    {tile.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
