import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import VeteranBadge from '@/components/ui/VeteranBadge';

export default function Hero() {
  return (
    <section
      className="relative min-h-[90svh] flex items-center bg-navy overflow-hidden"
      aria-label="Hero"
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg, transparent, transparent 40px,
            rgba(212,175,55,0.5) 40px, rgba(212,175,55,0.5) 41px
          ), repeating-linear-gradient(
            -45deg, transparent, transparent 40px,
            rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px
          )`,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Star className="text-patriot-red fill-patriot-red" size={14} aria-hidden="true" />
              <span className="font-body text-white/60 text-xs uppercase tracking-[0.2em]">
                Veteran-Owned &amp; Operated
              </span>
              <Star className="text-patriot-red fill-patriot-red" size={14} aria-hidden="true" />
            </div>

            <h1 className="font-heading font-bold text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-6">
              Precision Crafted.
              <br />
              <span className="text-patriot-red">Veteran Built.</span>
            </h1>

            <p className="font-body text-white/75 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
              Custom laser engraving for cutting boards, business cards, granite, and more.
              Every piece made with military precision and American pride.
            </p>

            <div className="flex flex-wrap gap-4 items-center mb-10">
              <Link
                href="/custom-order"
                className="inline-flex items-center gap-2 bg-patriot-red hover:bg-patriot-red-dark text-white font-body font-semibold px-6 py-3 rounded-md transition-colors duration-150 cursor-pointer"
              >
                Start Custom Order <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white font-body font-semibold px-6 py-3 rounded-md transition-colors duration-150"
              >
                Shop Products
              </Link>
            </div>

            <VeteranBadge />
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <Image
              src="/TNDS Logo.jpeg"
              alt="Top Notch Design Studio"
              width={380}
              height={380}
              className="rounded-xl shadow-2xl shadow-patriot-red/20"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
