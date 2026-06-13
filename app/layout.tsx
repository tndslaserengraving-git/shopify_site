import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Top Notch Design Studio | Veteran-Owned Laser Engraving',
  description:
    'Custom laser engraving by a veteran-owned studio. Cutting boards, business cards, granite, and more.',
  openGraph: {
    title: 'Top Notch Design Studio | Veteran-Owned Laser Engraving',
    description:
      'Custom laser engraving by a veteran-owned studio. Cutting boards, business cards, granite, and more.',
    images: [{ url: '/tnds-logo-new.jpg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Logo fonts — Abril Fatface, Anton, Oswald, Playfair Display */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Anton&family=Oswald:wght@600;700&family=Playfair+Display:ital,wght@1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-1XKTDW0S6E" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1XKTDW0S6E');
        `}</Script>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
