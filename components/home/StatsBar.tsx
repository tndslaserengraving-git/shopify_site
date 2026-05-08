export default function StatsBar() {
  const stats = [
    { value: '100%', label: 'Made to Order' },
    { value: '6', label: 'Materials Available' },
    { value: '24h', label: 'Avg. Response Time' },
    { value: '20+', label: 'Years of Military Service' },
  ];

  return (
    <div style={{ borderTop: '1px solid rgba(201,162,39,0.15)', borderBottom: '1px solid rgba(201,162,39,0.15)', background: '#111214' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center py-5 text-center"
            style={{ borderRight: i < 3 ? '1px solid rgba(201,162,39,0.1)' : 'none' }}
          >
            <div
              className="gold-text font-heading font-black leading-none mb-1"
              style={{ fontSize: 28 }}
            >
              {s.value}
            </div>
            <div className="tac-label" style={{ fontSize: 9 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
