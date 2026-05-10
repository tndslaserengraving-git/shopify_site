import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.topnotchdesignstudio.com'),
  title: 'Top Notch Design Studio | Veteran-Owned Laser Engraving',
  description:
    'Custom laser engraving by a veteran-owned studio. Cutting boards, business cards, granite, and more.',
  icons: { icon: '/tnds-logo-new.jpg' },
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
