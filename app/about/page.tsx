import { Shield, Star, Award } from 'lucide-react';
import VeteranBadge from '@/components/ui/VeteranBadge';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Hero card */}
      <div
        className="rounded-xl p-8 sm:p-12 mb-12 relative overflow-hidden"
        style={{ background: '#111214', border: '1px solid rgba(201,162,39,0.15)' }}
      >
        {/* Diagonal accent lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.04,
            backgroundImage:
              'repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(201,162,39,0.8) 40px, rgba(201,162,39,0.8) 41px)',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <VeteranBadge className="mb-5" />
          <h1
            className="font-heading font-black text-brand-text leading-tight mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.02em' }}
          >
            Built on Service.<br />
            <span className="gold-text">Crafted with Pride.</span>
          </h1>
          <p className="font-body text-white/60 text-lg leading-relaxed max-w-2xl">
            Top Notch Design Studio was founded by a U.S. military veteran determined
            to bring the same precision, discipline, and commitment to excellence from
            service into every laser-engraved piece we create.
          </p>
        </div>
      </div>

      {/* Value pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        {[
          {
            icon: Shield,
            title: 'Veteran-Owned',
            body: 'Founded and operated by a U.S. military veteran. Service is in our DNA.',
          },
          {
            icon: Star,
            title: 'Precision Crafted',
            body: 'Every cut, every line, every engraving made with meticulous attention to detail.',
          },
          {
            icon: Award,
            title: 'Quality Guaranteed',
            body: "We're not satisfied until you are. Every piece leaves our studio with pride.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="text-center p-6 rounded-lg"
            style={{ background: '#111214', border: '1px solid rgba(201,162,39,0.12)' }}
          >
            <Icon
              size={26}
              aria-hidden="true"
              style={{ color: '#C9A227', margin: '0 auto 12px' }}
            />
            <h3 className="font-heading font-bold text-brand-text text-base mb-2">{title}</h3>
            <p className="font-body text-white/45 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div>
        <div className="section-rule" />
        <span className="tac-label">Our Story</span>
        <h2
          className="font-heading font-black text-brand-text mt-2 mb-6"
          style={{ fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-0.01em' }}
        >
          From the Field to the Workshop
        </h2>
        <div className="space-y-4 font-body text-white/50 text-base leading-relaxed">
          <p>
            After years of military service, our founder discovered a love for craftsmanship
            and the art of laser engraving. What started as a hobby quickly became a passion —
            and then a business built around creating meaningful, personalized pieces.
          </p>
          <p>
            Based in the United States, Top Notch Design Studio specializes in custom laser
            engraving on wood, slate, acrylic, glass, and metal. We work with individuals,
            families, and businesses to create pieces that last a lifetime.
          </p>
          <p>
            Whether you need a wedding gift, a set of branded business cards, or a
            commemorative piece for a fellow veteran — we're here to make it happen.
          </p>
        </div>
      </div>
    </div>
  );
}
