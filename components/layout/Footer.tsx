import Link from 'next/link';
import { Camera, Globe, ExternalLink } from 'lucide-react';
import VeteranBadge from '@/components/ui/VeteranBadge';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-heading font-bold text-lg mb-2">Top Notch Design Studio</p>
            <VeteranBadge size="sm" className="mb-3" />
            <p className="font-body text-white/60 text-sm">
              Precision laser engraving. Every piece crafted with care and military precision.
            </p>
          </div>
          <div>
            <p className="font-heading font-semibold mb-3">Quick Links</p>
            <ul className="space-y-2 font-body text-sm text-white/70">
              {[
                ['/shop', 'Shop'],
                ['/custom-order', 'Custom Orders'],
                ['/gallery', 'Gallery'],
                ['/about', 'About'],
                ['/contact', 'Contact'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-heading font-semibold mb-3">Connect</p>
            <div className="flex gap-4">
              <a
                href="https://www.etsy.com/shop/tndslaserengraving"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Etsy Shop"
              >
                <ExternalLink size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
                <Camera size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center font-body text-sm text-white/40">
          © {new Date().getFullYear()} Top Notch Design Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
