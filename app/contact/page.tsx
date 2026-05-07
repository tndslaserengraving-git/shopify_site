'use client';
import { Mail, ExternalLink, Camera, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="section-rule" />
      <span className="tac-label">Get In Touch</span>
      <h1
        className="font-heading font-black text-brand-text mt-2 mb-2"
        style={{ fontSize: 'clamp(30px, 4vw, 44px)', letterSpacing: '-0.02em' }}
      >
        Contact Us
      </h1>
      <p className="font-body text-white/45 mb-10">
        Questions, custom requests, or just want to say hello — we'd love to hear from you.
      </p>

      <div className="flex flex-col gap-3 mb-10">
        {[
          {
            href: 'mailto:topnotchdesignstudio@email.com',
            icon: Mail,
            label: 'Email',
            value: 'topnotchdesignstudio@email.com',
            external: false,
          },
          {
            href: 'https://jxuwfh-mn.myshopify.com',
            icon: ExternalLink,
            label: 'Shop',
            value: 'jxuwfh-mn.myshopify.com',
            external: true,
          },
          {
            href: 'https://www.instagram.com/tndslaserengraving',
            icon: Camera,
            label: 'Instagram',
            value: '@tndslaserengraving',
            external: true,
          },
        ].map(({ href, icon: Icon, label, value, external }) => (
          <a
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="group flex items-center gap-4 p-5 rounded-lg transition-all duration-150 no-underline"
            style={{
              background: '#111214',
              border: '1px solid rgba(201,162,39,0.15)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.4)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.15)';
            }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-md"
              style={{
                width: 40, height: 40,
                background: 'rgba(201,162,39,0.1)',
                border: '1px solid rgba(201,162,39,0.2)',
                color: '#C9A227',
              }}
            >
              <Icon size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="font-body font-bold text-brand-text text-sm">{label}</p>
              <p
                className="font-body text-white/45 text-sm transition-colors duration-150"
                style={{ color: 'rgba(237,235,230,0.45)' }}
              >
                {value}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* CTA */}
      <div
        className="p-6 rounded-lg text-center"
        style={{ background: '#111214', border: '1px solid rgba(201,162,39,0.15)' }}
      >
        <span className="tac-label block mb-2">Ready to order?</span>
        <p className="font-body text-white/55 text-sm mb-5">
          Use our step-by-step wizard to describe exactly what you need.
        </p>
        <Link href="/custom-order" className="btn-gold">
          Start Custom Order <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
