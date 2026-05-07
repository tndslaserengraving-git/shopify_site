import { Shield, Check } from 'lucide-react';

export default function VeteranStory() {
  const values = [
    'Military-grade precision on every piece',
    'Satisfaction guaranteed, no exceptions',
    'Veteran-owned, American-operated',
  ];

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ background: '#111214', borderTop: '1px solid rgba(201,162,39,0.12)' }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Copy */}
        <div>
          <div className="section-rule" />
          <span className="tac-label block mb-3">Our Story</span>
          <h2
            className="font-heading font-black text-brand-text leading-tight mb-6"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', letterSpacing: '-0.02em' }}
          >
            Built on Service.<br />
            <span className="gold-text">Crafted with Pride.</span>
          </h2>
          <p className="font-body text-white/50 text-base leading-relaxed mb-4">
            Top Notch Design Studio was founded by a U.S. military veteran who brought
            the same discipline, attention to detail, and commitment to excellence from
            service into every engraved piece we create.
          </p>
          <p className="font-body text-white/50 text-base leading-relaxed mb-8">
            Whether it&apos;s a personalized gift for a loved one, branded materials for your
            business, or a commemorative piece — every order is treated with the care it
            deserves.
          </p>

          {/* Values checklist */}
          <ul className="flex flex-col gap-3">
            {values.map((v) => (
              <li key={v} className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    background: 'rgba(201,162,39,0.1)',
                    border: '1px solid rgba(201,162,39,0.3)',
                    color: '#C9A227',
                  }}
                >
                  <Check size={11} aria-hidden="true" />
                </div>
                <span className="font-body font-semibold text-white/50" style={{ fontSize: 13 }}>
                  {v}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Owner photo placeholder */}
        <div className="relative">
          <div
            className="bracket-box rounded-lg flex flex-col items-center justify-center"
            style={{
              aspectRatio: '4/5',
              background: '#0A0A0B',
              border: '1px solid rgba(201,162,39,0.15)',
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 16px, rgba(201,162,39,0.03) 16px, rgba(201,162,39,0.03) 17px)',
            }}
          >
            <Shield
              size={40}
              className="text-gold mb-3"
              style={{ opacity: 0.25 }}
              aria-hidden="true"
            />
            <span className="font-mono text-white/20" style={{ fontSize: 11 }}>
              [ owner photo ]
            </span>
          </div>
          {/* Gold accent bar */}
          <div
            className="absolute rounded-sm"
            style={{
              bottom: -10,
              left: 24,
              right: 24,
              height: 3,
              background: 'linear-gradient(90deg, #7A5C10, #C9A227, transparent)',
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
