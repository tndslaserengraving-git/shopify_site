import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CustomOrderBand() {
  return (
    <section
      className="py-20 px-4 text-center"
      style={{ background: 'linear-gradient(135deg, #1B2E4B 0%, #DC2626 100%)' }}
    >
      <h2 className="font-heading font-bold text-white text-3xl sm:text-4xl mb-4">
        Have something specific in mind?
      </h2>
      <p className="font-body text-white/80 text-lg max-w-xl mx-auto mb-8">
        Names, logos, dates, custom designs — we bring your vision to life with
        precision and care.
      </p>
      <Link
        href="/custom-order"
        className="inline-flex items-center gap-2 bg-white text-navy font-body font-bold px-8 py-3 rounded-md hover:bg-white/90 transition-colors duration-150 cursor-pointer"
      >
        Start Your Custom Order <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
