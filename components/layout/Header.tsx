'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

// Inline SVG logo — metallic shimmer, matches brand fonts
function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Top Notch Design Studio"
    >
      <defs>
        <linearGradient id="hGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#3D2406"/>
          <stop offset="18%"  stopColor="#9A7318"/>
          <stop offset="35%"  stopColor="#C9A227"/>
          <stop offset="50%"  stopColor="#F0D878"/>
          <stop offset="65%"  stopColor="#C9A227"/>
          <stop offset="82%"  stopColor="#9A7318"/>
          <stop offset="100%" stopColor="#3D2406"/>
        </linearGradient>
        <linearGradient id="hShimmer" gradientUnits="userSpaceOnUse" x1="-600" y1="0" x2="-200" y2="500">
          <stop offset="42%"  stopColor="#FFF8DC" stopOpacity="0"/>
          <stop offset="50%"  stopColor="#FFF8DC" stopOpacity="0.6"/>
          <stop offset="58%"  stopColor="#FFF8DC" stopOpacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            values="-600 0; 1100 0" dur="3.2s" repeatCount="indefinite"/>
        </linearGradient>
        <mask id="hMask">
          <rect x="10" y="10" width="480" height="480" fill="none" stroke="white" strokeWidth="3.5" rx="2"/>
          <text x="192" y="90" textAnchor="middle" fontFamily="'Abril Fatface', serif" fontSize="62" fill="white">Top Notch</text>
          <rect x="384" y="100" width="52" height="14" rx="1" fill="white"/>
          <polygon points="384,114 436,114 420,208 400,208" fill="white"/>
          <polygon points="400,208 420,208 410,224" fill="white"/>
          <text x="34" y="218" textAnchor="start" fontFamily="'Anton', sans-serif" fontSize="124" fill="white">TNDS</text>
          <rect x="34" y="230" width="440" height="2.5" fill="white"/>
          <polygon points="410,216 412,224 420,220 416,228 425,230 416,232 420,240 412,236 410,244 408,236 400,240 404,232 395,230 404,228 400,220 408,224" fill="white"/>
          <text x="250" y="267" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="21" letterSpacing="3" fill="white">LASER ENGRAVING</text>
          <text x="250" y="293" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="21" letterSpacing="3" fill="white">AND CRAFTS</text>
          <text x="250" y="400" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="800" fontStyle="italic" fontSize="68" fill="white">Design Studio</text>
        </mask>
      </defs>
      <rect width="500" height="500" fill="#0A0A0B" rx="4"/>
      <rect x="10" y="10" width="480" height="480" fill="none" stroke="url(#hGold)" strokeWidth="3.5" rx="2"/>
      <text x="192" y="90" textAnchor="middle" fontFamily="'Abril Fatface', serif" fontSize="62" fill="url(#hGold)">Top Notch</text>
      <rect x="384" y="100" width="52" height="14" rx="1" fill="url(#hGold)"/>
      <polygon points="384,114 436,114 420,208 400,208" fill="url(#hGold)"/>
      <polygon points="400,208 420,208 410,224" fill="url(#hGold)"/>
      <text x="34" y="218" textAnchor="start" fontFamily="'Anton', sans-serif" fontSize="124" fill="url(#hGold)">TNDS</text>
      <rect x="34" y="230" width="440" height="2.5" fill="url(#hGold)"/>
      <polygon points="410,216 412,224 420,220 416,228 425,230 416,232 420,240 412,236 410,244 408,236 400,240 404,232 395,230 404,228 400,220 408,224" fill="url(#hGold)"/>
      <text x="250" y="267" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="21" letterSpacing="3" fill="url(#hGold)">LASER ENGRAVING</text>
      <text x="250" y="293" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="21" letterSpacing="3" fill="url(#hGold)">AND CRAFTS</text>
      <text x="250" y="400" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="800" fontStyle="italic" fontSize="68" fill="url(#hGold)">Design Studio</text>
      <rect width="500" height="500" fill="url(#hShimmer)" mask="url(#hMask)"/>
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,10,11,0.95)' : '#0A0A0B',
        borderBottom: scrolled ? '1px solid rgba(201,162,39,0.15)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <LogoMark size={44} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="nav-link">{label}</Link>
            ))}
            <Link
              href="/custom-order"
              className="btn-gold"
              style={{ padding: '8px 16px', fontSize: 11 }}
            >
              CUSTOM ORDER
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-brand-text cursor-pointer p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="md:hidden pb-5 flex flex-col gap-3 border-t border-white/5 pt-4">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="nav-link text-sm py-1"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/custom-order"
              className="btn-gold w-fit"
              style={{ padding: '9px 18px', fontSize: 11 }}
              onClick={() => setOpen(false)}
            >
              CUSTOM ORDER
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
