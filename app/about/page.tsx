import { Shield, Star, Award } from 'lucide-react';
import VeteranBadge from '@/components/ui/VeteranBadge';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-navy rounded-2xl p-8 sm:p-12 mb-12">
        <VeteranBadge className="mb-4" />
        <h1 className="font-heading font-bold text-white text-4xl sm:text-5xl mb-4 leading-tight">
          Built on Service.
          <br />
          <span className="text-patriot-red">Crafted with Pride.</span>
        </h1>
        <p className="font-body text-white/75 text-lg leading-relaxed">
          Top Notch Design Studio was founded by a U.S. military veteran determined
          to bring the same precision, discipline, and commitment to excellence from
          service into every laser-engraved piece we create.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
          <div key={title} className="text-center p-6 rounded-xl bg-navy/5">
            <Icon className="text-patriot-red mx-auto mb-3" size={28} aria-hidden="true" />
            <h3 className="font-heading font-bold text-navy text-lg mb-2">{title}</h3>
            <p className="font-body text-brand-text/70 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-heading font-bold text-navy text-2xl mb-4">Our Story</h2>
        <div className="space-y-4 font-body text-brand-text/75 text-base leading-relaxed">
          <p>
            After years of military service, our founder discovered a love for craftsmanship
            and the art of laser engraving. What started as a hobby quickly became a passion —
            and then a business built around creating meaningful, personalized pieces.
          </p>
          <p>
            Based in the United States, Top Notch Design Studio specializes in custom laser
            engraving on wood cutting boards, granite, acrylic, and paper. We work with
            individuals, families, and businesses to create pieces that last a lifetime.
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
