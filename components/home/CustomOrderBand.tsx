import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CustomOrderBand() {
  return (
    <section
      className="relative overflow-hidden py-20 px-4"
      style={{ background: '#111214' }}
    >
      {/* Vertical gold side bars */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, #C9A227, transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, #C9A227, transparent)' }}
        aria-hidden="true"
      />
      {/* Diagonal accent lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.05,
          backgroundImage:
            'repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(201,162,39,0.8) 40px, rgba(201,162,39,0.8) 41px)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <span className="tac-label block mb-4">Custom Orders</span>
        <h2
          className="font-heading font-black text-brand-text mb-4 leading-tight"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em' }}
        >
          Have something <br />
          <span className="gold-text">specific in mind?</span>
        </h2>
        <p className="font-body text-white/55 text-base max-w-md mx-auto mb-8 leading-relaxed">
          Names, logos, dates, custom designs — we bring your vision to life with
          military precision and care.
        </p>
        <Link href="/custom-order" className="btn-gold">
          Start Your Custom Order <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
