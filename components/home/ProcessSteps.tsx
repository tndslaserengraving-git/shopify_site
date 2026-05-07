export default function ProcessSteps() {
  const steps = [
    {
      n: '01',
      title: 'Describe Your Vision',
      body: 'Tell us what you want engraved — product type, text, and any design references.',
    },
    {
      n: '02',
      title: 'We Quote & Confirm',
      body: 'You receive a quote within 24 hours. No commitment until you approve.',
    },
    {
      n: '03',
      title: 'Crafted & Delivered',
      body: 'Your piece is precision-engraved and shipped directly to your door.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="section-rule mx-auto" />
        <span className="tac-label">How It Works</span>
        <h2
          className="font-heading font-black text-brand-text mt-2"
          style={{ fontSize: 'clamp(24px, 3vw, 34px)', letterSpacing: '-0.01em' }}
        >
          Three Steps to Your Custom Piece
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="relative p-8 rounded-lg"
            style={{
              background: '#111214',
              border: '1px solid rgba(201,162,39,0.15)',
            }}
          >
            {/* Connector line (desktop only, after steps 1 and 2) */}
            {i < 2 && (
              <div
                className="hidden md:block absolute top-10 pointer-events-none"
                style={{
                  left: 'calc(100% + 2px)',
                  width: 'calc(100% - 4px)',
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(201,162,39,0.35), transparent)',
                  zIndex: 0,
                }}
                aria-hidden="true"
              />
            )}

            <div
              className="gold-text font-heading font-black leading-none mb-5"
              style={{ fontSize: 44, opacity: 0.8 }}
            >
              {s.n}
            </div>
            <h3
              className="font-heading font-bold text-brand-text mb-3"
              style={{ fontSize: 16 }}
            >
              {s.title}
            </h3>
            <p
              className="font-body text-white/45 leading-relaxed"
              style={{ fontSize: 13 }}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
