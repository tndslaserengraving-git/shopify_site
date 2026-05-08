'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];


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
          <Link href="/" className="flex items-center no-underline">
            <Image
              src="/TNDS-logo-horizontal.svg"
              alt="Top Notch Design Studio"
              width={182}
              height={40}
              priority
            />
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
