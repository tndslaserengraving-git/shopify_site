export const dynamic = 'force-dynamic'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0A0A0B' }}
    >
      <div className="text-center max-w-md">
        <div className="section-rule" style={{ margin: '0 auto 16px' }} />
        <h1
          className="font-heading font-black text-brand-text mb-3"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '-0.02em' }}
        >
          Page Not Found
        </h1>
        <p className="font-body text-white/50 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-outline inline-flex" style={{ justifyContent: 'center' }}>
          Back to Home
        </Link>
      </div>
    </main>
  )
}
