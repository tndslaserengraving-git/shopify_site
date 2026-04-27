'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import VeteranBadge from '@/components/ui/VeteranBadge';

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-navy sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="font-heading font-bold text-white text-base sm:text-lg">
              Top Notch Design Studio
            </span>
            <VeteranBadge size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-white/80 hover:text-white transition-colors duration-150 text-sm font-medium"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/custom-order"
              className="bg-patriot-red hover:bg-patriot-red-dark text-white font-body font-semibold text-sm px-4 py-2 rounded-md transition-colors duration-150 cursor-pointer"
            >
              Custom Order
            </Link>
          </nav>

          <button
            className="md:hidden text-white cursor-pointer p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-white/80 text-sm font-medium py-2"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/custom-order"
              className="bg-patriot-red hover:bg-patriot-red-dark text-white font-body font-semibold text-sm px-4 py-2 rounded-md w-fit transition-colors duration-150"
              onClick={() => setOpen(false)}
            >
              Custom Order
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
