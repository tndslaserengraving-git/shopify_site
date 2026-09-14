import Link from 'next/link';
import { Camera, PlayCircle, Music2, Shield } from 'lucide-react';

// Inline SVG logo — static (no animation needed in footer)
function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Top Notch Design Studio"
    >
      <defs>
        <linearGradient id="fGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#3D2406"/>
          <stop offset="35%"  stopColor="#C9A227"/>
          <stop offset="50%"  stopColor="#F0D878"/>
          <stop offset="65%"  stopColor="#C9A227"/>
          <stop offset="100%" stopColor="#3D2406"/>
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="#0A0A0B" rx="4"/>
      <rect x="10" y="10" width="480" height="480" fill="none" stroke="url(#fGold)" strokeWidth="3.5" rx="2"/>
      <text x="192" y="90" textAnchor="middle" fontFamily="'Abril Fatface', serif" fontSize="62" fill="url(#fGold)">Top Notch</text>
      <rect x="384" y="100" width="52" height="14" rx="1" fill="url(#fGold)"/>
      <polygon points="384,114 436,114 420,208 400,208" fill="url(#fGold)"/>
      <polygon points="400,208 420,208 410,224" fill="url(#fGold)"/>
      <text x="34" y="218" textAnchor="start" fontFamily="'Anton', sans-serif" fontSize="124" fill="url(#fGold)">TNDS</text>
      <rect x="34" y="230" width="440" height="2.5" fill="url(#fGold)"/>
      <polygon points="410,216 412,224 420,220 416,228 425,230 416,232 420,240 412,236 410,244 408,236 400,240 404,232 395,230 404,228 400,220 408,224" fill="url(#fGold)"/>
      <text x="250" y="267" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="21" letterSpacing="3" fill="url(#fGold)">LASER ENGRAVING</text>
      <text x="250" y="293" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="21" letterSpacing="3" fill="url(#fGold)">AND CRAFTS</text>
      <text x="250" y="400" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="800" fontStyle="italic" fontSize="68" fill="url(#fGold)">Design Studio</text>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: '#07070A', borderTop: '1px solid rgba(201,162,39,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LogoMark size={48} />
              <div className="leading-none">
                <div
                  className="font-heading font-black text-brand-text"
                  style={{ fontSize: 12, letterSpacing: '0.1em' }}
                >
                  TOP NOTCH
                </div>
                <div className="tac-label" style={{ fontSize: 8, letterSpacing: '0.28em', marginTop: 1 }}>
                  DESIGN STUDIO
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={12} style={{ color: '#C9A227' }} aria-hidden="true" />
              <span className="tac-label" style={{ fontSize: 9 }}>Veteran-Owned &amp; Operated</span>
            </div>
            <p className="font-body text-white/40 text-sm leading-relaxed">
              Precision laser engraving. Every piece crafted with care and military precision.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="tac-label mb-4" style={{ fontSize: 9 }}>Quick Links</p>
            <ul className="flex flex-col gap-2">
              {[
                ['/shop', 'Shop'],
                ['/custom-order', 'Custom Orders'],
                ['/gallery', 'Gallery'],
                ['/videos', 'Videos'],
                ['/reviews', 'Reviews'],
                ['/about', 'About'],
                ['/contact', 'Contact'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-white/40 hover:text-gold-light transition-colors duration-150 no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="tac-label mb-4" style={{ fontSize: 9 }}>Connect</p>
            <div className="flex gap-3">
              {[
                { href: 'https://www.instagram.com/tndslaserengraving', Icon: Camera, label: 'Instagram' },
                { href: 'https://www.youtube.com/@TNDSLaserEngraving', Icon: PlayCircle, label: 'YouTube' },{ href: 'https://www.tiktok.com/@tnds.laser.engrav', Icon: Music2, label: 'TikTok' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="font-body font-bold text-white/40 hover:text-gold transition-colors duration-150 flex items-center gap-1.5 no-underline"
                  style={{
                    fontSize: 11,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(201,162,39,0.15)',
                    padding: '6px 10px',
                    borderRadius: 4,
                    letterSpacing: '0.05em',
                  }}
                >
                  <Icon size={13} aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="font-body text-center text-xs text-white/25 pt-6"
          style={{ borderTop: '1px solid rgba(237,235,230,0.06)' }}
        >
          © {new Date().getFullYear()} Top Notch Design Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
