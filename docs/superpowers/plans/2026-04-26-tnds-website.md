# Top Notch Design Studio — Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a branded Next.js site for a veteran-owned laser engraving business that showcases Etsy listings via API, tells the veteran brand story, and captures custom order requests via a 4-step wizard.

**Architecture:** Next.js 14 App Router with TypeScript and Tailwind. Etsy v3 API data fetched server-side with ISR (1hr revalidation). Custom order wizard submits to a Next.js API route that emails the owner via Resend. Gallery photos served from Cloudinary.

**Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS · Etsy v3 API · Resend · Vercel Blob · Cloudinary · Lucide React · Vitest + React Testing Library · 21st.dev MCP (component generation)

---

## File Map

```
app/
  layout.tsx                          root layout — fonts, Header, Footer
  globals.css                         Tailwind base + font imports
  page.tsx                            Homepage assembly
  shop/
    page.tsx                          Product grid (Etsy listings, section filter)
    [listingId]/page.tsx              Single listing detail
  custom-order/
    page.tsx                          Wizard shell page
  gallery/
    page.tsx                          Portfolio grid
  about/
    page.tsx                          Veteran story
  contact/
    page.tsx                          Contact info + form
  api/
    custom-order/
      route.ts                        POST — validates + emails via Resend
components/
  layout/
    Header.tsx                        Sticky nav + mobile hamburger
    Footer.tsx                        Navy footer + veteran badge
  ui/
    VeteranBadge.tsx                  "Veteran-Owned & Operated" badge
    ProductCard.tsx                   Glassmorphism Etsy listing card
  home/
    Hero.tsx                          Full-height hero with patriotic overlay
    FeaturedProducts.tsx              4 Etsy listings strip
    CustomOrderBand.tsx               Navy-to-red gradient CTA band
    GalleryTeaser.tsx                 6-photo masonry teaser
    VeteranStory.tsx                  Split-layout brand story
  shop/
    ProductGrid.tsx                   Filterable grid by Etsy section
  custom-order/
    OrderWizard.tsx                   Wizard state + step router
    WizardNavigation.tsx              Back/Next/Submit buttons
    steps/
      Step1ProductType.tsx            Card grid — product type selection
      Step2Details.tsx                Adaptive personalization fields
      Step3Reference.tsx              File upload + notes
      Step4Contact.tsx                Contact info + submit
  gallery/
    GalleryGrid.tsx                   Responsive masonry photo grid
lib/
  etsy.ts                             Etsy v3 API client + formatPrice
  resend.ts                           Resend email helper
types/
  etsy.ts                             Etsy API response types
  wizard.ts                           Wizard state + step types
config/
  gallery.config.ts                   Cloudinary photo URLs + alt text
tests/
  setup.ts                            @testing-library/jest-dom setup
  lib/
    etsy.test.ts                      Etsy client unit tests
  api/
    custom-order.test.ts              API route unit tests
  components/
    OrderWizard.test.tsx              Wizard state + navigation tests
tailwind.config.ts                    Design tokens (colors, fonts)
next.config.ts                        Image domains (Etsy CDN, Cloudinary)
vitest.config.ts                      Vitest + jsdom config
.env.local                            API keys (Etsy, Resend, Cloudinary, owner email)
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `.env.local`

- [ ] **Step 1: Scaffold Next.js app**

```bash
cd C:/Users/El_Gu/Projects/TNDS_SITE
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

Accept all defaults. Expected: project files created, `npm run dev` works.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install resend lucide-react @vercel/blob
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: Create vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 4: Create test setup file**

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Add test script to package.json**

In `package.json`, add to `scripts`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 6: Create .env.local**

Create `.env.local`:

```
ETSY_API_KEY=your_etsy_api_key_here
ETSY_SHOP_ID=your_etsy_shop_id_here
RESEND_API_KEY=your_resend_api_key_here
OWNER_EMAIL=your_email@example.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

To get `ETSY_SHOP_ID`: visit https://www.etsy.com/shop/tndslaserengraving — the numeric shop ID is in the page source or via `GET https://openapi.etsy.com/v3/application/shops?shop_name=tndslaserengraving` with the API key header.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with vitest"
```

---

## Task 2: Design System

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './config/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2E4B',
          light: '#243d63',
          dark: '#0f1e32',
        },
        patriot: {
          red: '#DC2626',
          'red-dark': '#b91c1c',
        },
        steel: '#2563EB',
        brand: {
          bg: '#F8FAFC',
          text: '#1E293B',
        },
      },
      fontFamily: {
        heading: ['Rubik', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Replace app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,300;0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;1,6..12,400&family=Rubik:wght@300;400;500;600;700;800&display=swap');

body {
  font-family: 'Nunito Sans', sans-serif;
  background-color: #F8FAFC;
  color: #1E293B;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure design system tokens and fonts"
```

---

## Task 3: Etsy Types + API Client

**Files:**
- Create: `types/etsy.ts`
- Create: `lib/etsy.ts`
- Create: `tests/lib/etsy.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/lib/etsy.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getActiveListings, getListing, getShopSections, formatPrice } from '@/lib/etsy';
import type { EtsyListing } from '@/types/etsy';

const mockListing: EtsyListing = {
  listing_id: 1,
  title: 'Custom Cutting Board',
  description: 'Laser engraved cutting board.',
  price: { amount: 4500, divisor: 100, currency_code: 'USD' },
  url: 'https://www.etsy.com/listing/1',
  state: 'active',
  quantity: 10,
  tags: ['custom', 'wood'],
  shop_section_id: null,
};

describe('getActiveListings', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.ETSY_API_KEY = 'test-key';
  });

  it('returns listings array on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ count: 1, results: [mockListing] }),
    });
    const listings = await getActiveListings('12345');
    expect(listings).toHaveLength(1);
    expect(listings[0].title).toBe('Custom Cutting Board');
  });

  it('sends correct x-api-key header', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ count: 0, results: [] }),
    });
    await getActiveListings('12345');
    expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(
      expect.stringContaining('/shops/12345/listings/active'),
      expect.objectContaining({ headers: { 'x-api-key': 'test-key' } })
    );
  });

  it('throws on API error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 403 });
    await expect(getActiveListings('12345')).rejects.toThrow('Etsy API error: 403');
  });
});

describe('formatPrice', () => {
  it('formats USD correctly', () => {
    expect(formatPrice({ amount: 4500, divisor: 100, currency_code: 'USD' })).toBe('$45.00');
  });

  it('formats cents correctly', () => {
    expect(formatPrice({ amount: 999, divisor: 100, currency_code: 'USD' })).toBe('$9.99');
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run tests/lib/etsy.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/etsy'`

- [ ] **Step 3: Create types/etsy.ts**

```typescript
export interface EtsyPrice {
  amount: number;
  divisor: number;
  currency_code: string;
}

export interface EtsyListingImage {
  listing_image_id: number;
  listing_id: number;
  url_fullxfull: string;
  url_570xN: string;
  url_170x135: string;
  alt_text: string | null;
  rank: number;
}

export interface EtsyListing {
  listing_id: number;
  title: string;
  description: string;
  price: EtsyPrice;
  url: string;
  state: 'active' | 'inactive' | 'sold_out' | 'draft';
  quantity: number;
  tags: string[];
  shop_section_id: number | null;
  images?: EtsyListingImage[];
  primary_image?: EtsyListingImage;
}

export interface EtsyShopSection {
  shop_section_id: number;
  title: string;
  active_listing_count: number;
}

export interface EtsyListingsResponse {
  count: number;
  results: EtsyListing[];
}

export interface EtsySectionsResponse {
  count: number;
  results: EtsyShopSection[];
}
```

- [ ] **Step 4: Create lib/etsy.ts**

```typescript
import type {
  EtsyListing,
  EtsyListingImage,
  EtsyListingsResponse,
  EtsyShopSection,
  EtsySectionsResponse,
  EtsyPrice,
} from '@/types/etsy';

const ETSY_BASE = 'https://openapi.etsy.com/v3/application';

async function etsyFetch<T>(path: string, revalidate = 3600): Promise<T> {
  const res = await fetch(`${ETSY_BASE}${path}`, {
    headers: { 'x-api-key': process.env.ETSY_API_KEY! },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`Etsy API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getActiveListings(shopId: string): Promise<EtsyListing[]> {
  const data = await etsyFetch<EtsyListingsResponse>(
    `/shops/${shopId}/listings/active?limit=100`
  );
  return data.results;
}

export async function getListing(listingId: string): Promise<EtsyListing> {
  return etsyFetch<EtsyListing>(`/listings/${listingId}`);
}

export async function getListingImages(listingId: string): Promise<EtsyListingImage[]> {
  const data = await etsyFetch<{ results: EtsyListingImage[] }>(
    `/listings/${listingId}/images`
  );
  return data.results;
}

export async function getShopSections(shopId: string): Promise<EtsyShopSection[]> {
  const data = await etsyFetch<EtsySectionsResponse>(
    `/shops/${shopId}/sections`,
    86400
  );
  return data.results;
}

export function formatPrice(price: EtsyPrice): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency_code,
  }).format(price.amount / price.divisor);
}
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
npx vitest run tests/lib/etsy.test.ts
```

Expected: PASS — 5 tests passing.

- [ ] **Step 6: Commit**

```bash
git add types/etsy.ts lib/etsy.ts tests/lib/etsy.test.ts
git commit -m "feat: add Etsy API client with types and tests"
```

---

## Task 4: Wizard Types

**Files:**
- Create: `types/wizard.ts`

- [ ] **Step 1: Create types/wizard.ts**

```typescript
export type ProductType =
  | 'cutting-board'
  | 'business-cards'
  | 'granite'
  | 'acrylic'
  | 'other';

export type DesignStyle = 'text' | 'artwork' | 'upload';
export type ContactMethod = 'email' | 'phone';

export interface WizardState {
  step: 1 | 2 | 3 | 4;
  productType: ProductType | '';
  engraveText: string;
  size: string;
  quantity: number;
  material: string;
  designStyle: DesignStyle | '';
  referenceImage: File | null;
  notes: string;
  name: string;
  email: string;
  phone: string;
  contactMethod: ContactMethod;
}

export const initialWizardState: WizardState = {
  step: 1,
  productType: '',
  engraveText: '',
  size: '',
  quantity: 1,
  material: '',
  designStyle: '',
  referenceImage: null,
  notes: '',
  name: '',
  email: '',
  phone: '',
  contactMethod: 'email',
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  'cutting-board': 'Cutting Board',
  'business-cards': 'Business Cards',
  granite: 'Granite Cutting Board',
  acrylic: 'Acrylic',
  other: 'Custom / Other',
};

export const SIZE_OPTIONS: Record<ProductType, string[]> = {
  'cutting-board': ['8×10"', '10×14"', '12×18"', '14×20"', 'Custom'],
  'business-cards': ['Standard 3.5×2"', 'Square 2.5×2.5"', 'Custom'],
  granite: ['8×10"', '12×16"', 'Custom'],
  acrylic: ['4×6"', '8×10"', '12×16"', 'Custom'],
  other: ['Custom'],
};
```

- [ ] **Step 2: Commit**

```bash
git add types/wizard.ts
git commit -m "feat: add wizard state types and constants"
```

---

## Task 5: Layout Shell

**Files:**
- Create: `components/ui/VeteranBadge.tsx`
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create components/ui/VeteranBadge.tsx**

```tsx
import { Shield } from 'lucide-react';

interface Props {
  className?: string;
  size?: 'sm' | 'md';
}

export default function VeteranBadge({ className = '', size = 'md' }: Props) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const iconSize = size === 'sm' ? 14 : 16;
  return (
    <span className={`inline-flex items-center gap-1.5 font-body font-semibold text-white/90 ${textSize} ${className}`}>
      <Shield size={iconSize} className="text-patriot-red" aria-hidden="true" />
      Veteran-Owned &amp; Operated
    </span>
  );
}
```

- [ ] **Step 2: Create components/layout/Header.tsx**

```tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import VeteranBadge from '@/components/ui/VeteranBadge';

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-navy sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="font-heading font-bold text-white text-base sm:text-lg">
              Top Notch Design Studio
            </span>
            <VeteranBadge size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-white/80 hover:text-white transition-colors duration-150 text-sm font-medium"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/custom-order"
              className="bg-patriot-red hover:bg-patriot-red-dark text-white font-body font-semibold text-sm px-4 py-2 rounded-md transition-colors duration-150 cursor-pointer"
            >
              Custom Order
            </Link>
          </nav>

          <button
            className="md:hidden text-white cursor-pointer p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-white/80 text-sm font-medium py-2"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/custom-order"
              className="bg-patriot-red text-white font-body font-semibold text-sm px-4 py-2 rounded-md w-fit"
              onClick={() => setOpen(false)}
            >
              Custom Order
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create components/layout/Footer.tsx**

```tsx
import Link from 'next/link';
import { Instagram, Facebook, ExternalLink } from 'lucide-react';
import VeteranBadge from '@/components/ui/VeteranBadge';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-heading font-bold text-lg mb-2">Top Notch Design Studio</p>
            <VeteranBadge size="sm" className="mb-3" />
            <p className="font-body text-white/60 text-sm">
              Precision laser engraving. Every piece crafted with care and military precision.
            </p>
          </div>
          <div>
            <p className="font-heading font-semibold mb-3">Quick Links</p>
            <ul className="space-y-2 font-body text-sm text-white/70">
              {[
                ['/shop', 'Shop'],
                ['/custom-order', 'Custom Orders'],
                ['/gallery', 'Gallery'],
                ['/about', 'About'],
                ['/contact', 'Contact'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-heading font-semibold mb-3">Connect</p>
            <div className="flex gap-4">
              <a
                href="https://www.etsy.com/shop/tndslaserengraving"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Etsy Shop"
              >
                <ExternalLink size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center font-body text-sm text-white/40">
          © {new Date().getFullYear()} Top Notch Design Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Replace app/layout.tsx**

```tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Top Notch Design Studio | Veteran-Owned Laser Engraving',
  description:
    'Custom laser engraving by a veteran-owned studio. Cutting boards, business cards, granite, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Run dev server — verify header and footer render**

```bash
npm run dev
```

Open http://localhost:3000. Expected: navy header with logo + veteran badge, navy footer.

- [ ] **Step 6: Commit**

```bash
git add components/ app/layout.tsx
git commit -m "feat: add layout shell with Header, Footer, VeteranBadge"
```

---

## Task 6: Homepage Hero

**Files:**
- Create: `components/home/Hero.tsx`

> **21st.dev MCP tip:** Use `mcp__magic__21st_magic_component_builder` with prompt: "Full-height hero section, dark navy background, patriotic diagonal stripe overlay at 5% opacity, large bold heading in white with red accent span, two CTA buttons side by side (red primary + white outline secondary), veteran-owned star badge row below CTAs. Tailwind CSS, Next.js Link."

- [ ] **Step 1: Create components/home/Hero.tsx**

```tsx
import Link from 'next/link';
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
            rgba(220,38,38,0.5) 40px, rgba(220,38,38,0.5) 41px
          ), repeating-linear-gradient(
            -45deg, transparent, transparent 40px,
            rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px
          )`,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
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
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/Hero.tsx
git commit -m "feat: add homepage hero section"
```

---

## Task 7: ProductCard + FeaturedProducts

**Files:**
- Create: `components/ui/ProductCard.tsx`
- Create: `components/home/FeaturedProducts.tsx`

> **21st.dev MCP tip for ProductCard:** Use `mcp__magic__21st_magic_component_builder` with prompt: "E-commerce product card, glassmorphism style — backdrop-blur, white/80 bg, subtle border, rounded-xl, product image square aspect ratio on top, product name and price below, small 'View on Etsy' link with external-link icon. Tailwind CSS."

- [ ] **Step 1: Create components/ui/ProductCard.tsx**

```tsx
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { EtsyListing } from '@/types/etsy';
import { formatPrice } from '@/lib/etsy';

interface Props {
  listing: EtsyListing;
}

export default function ProductCard({ listing }: Props) {
  const image = listing.images?.[0] ?? listing.primary_image;
  const price = formatPrice(listing.price);

  return (
    <div className="rounded-xl overflow-hidden backdrop-blur-sm bg-white/80 border border-white/20 shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col">
      {image ? (
        <div className="relative aspect-square">
          <Image
            src={image.url_570xN}
            alt={image.alt_text ?? listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="aspect-square bg-navy/10 flex items-center justify-center">
          <span className="font-body text-navy/30 text-sm">No image</span>
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-heading font-semibold text-brand-text text-sm line-clamp-2 flex-1">
          {listing.title}
        </h3>
        <p className="font-body font-bold text-navy text-base">{price}</p>
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-steel hover:text-navy text-xs font-body font-medium transition-colors cursor-pointer"
        >
          View on Etsy <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create components/home/FeaturedProducts.tsx**

```tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { getActiveListings } from '@/lib/etsy';

export default async function FeaturedProducts() {
  const shopId = process.env.ETSY_SHOP_ID!;
  let listings: Awaited<ReturnType<typeof getActiveListings>> = [];

  try {
    const all = await getActiveListings(shopId);
    listings = all.slice(0, 4);
  } catch {
    return null;
  }

  if (listings.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading font-bold text-navy text-3xl">Featured Products</h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 font-body text-sm font-medium text-steel hover:text-navy transition-colors"
        >
          See All <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ProductCard key={listing.listing_id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/ProductCard.tsx components/home/FeaturedProducts.tsx
git commit -m "feat: add ProductCard and FeaturedProducts components"
```

---

## Task 8: Remaining Homepage Sections + page.tsx

**Files:**
- Create: `components/home/CustomOrderBand.tsx`
- Create: `components/home/GalleryTeaser.tsx`
- Create: `components/home/VeteranStory.tsx`
- Create: `config/gallery.config.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create config/gallery.config.ts**

```typescript
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';

function c(path: string) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/v1/tnds/${path}`;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export const galleryImages: GalleryImage[] = [
  { id: '1', url: c('gallery-1.jpg'), alt: 'Custom engraved cutting board' },
  { id: '2', url: c('gallery-2.jpg'), alt: 'Laser engraved business cards' },
  { id: '3', url: c('gallery-3.jpg'), alt: 'Granite cutting board engraving' },
  { id: '4', url: c('gallery-4.jpg'), alt: 'Personalized wood gift' },
  { id: '5', url: c('gallery-5.jpg'), alt: 'Custom acrylic engraving' },
  { id: '6', url: c('gallery-6.jpg'), alt: 'Engraved business card set' },
];
```

Upload actual photos to Cloudinary under the `tnds/` folder using the names above.

- [ ] **Step 2: Create components/home/CustomOrderBand.tsx**

```tsx
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
```

- [ ] **Step 3: Create components/home/GalleryTeaser.tsx**

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { galleryImages } from '@/config/gallery.config';

export default function GalleryTeaser() {
  const teaser = galleryImages.slice(0, 6);
  return (
    <section className="py-16 bg-navy/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-bold text-navy text-3xl">Our Work</h2>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 font-body text-sm font-medium text-steel hover:text-navy transition-colors"
          >
            Full Gallery <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {teaser.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create components/home/VeteranStory.tsx**

```tsx
import { Shield } from 'lucide-react';

export default function VeteranStory() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-patriot-red rounded-full" aria-hidden="true" />
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-patriot-red" size={18} aria-hidden="true" />
            <span className="font-body text-patriot-red font-semibold text-xs uppercase tracking-widest">
              Our Story
            </span>
          </div>
          <h2 className="font-heading font-bold text-navy text-3xl sm:text-4xl mb-4 leading-tight">
            Built on Service.
            <br />
            <span className="text-patriot-red">Crafted with Pride.</span>
          </h2>
          <p className="font-body text-brand-text/75 text-base leading-relaxed mb-4">
            Top Notch Design Studio was founded by a U.S. military veteran who brought
            the same discipline, attention to detail, and commitment to excellence from
            service into every engraved piece we create.
          </p>
          <p className="font-body text-brand-text/75 text-base leading-relaxed">
            Whether it's a personalized gift for a loved one, branded materials for your
            business, or a commemorative piece — every order is treated with the care it
            deserves.
          </p>
        </div>
        <div className="bg-navy/5 rounded-2xl aspect-square flex items-center justify-center">
          <span className="font-body text-navy/30 text-sm">Owner photo coming soon</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Replace app/page.tsx**

```tsx
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CustomOrderBand from '@/components/home/CustomOrderBand';
import GalleryTeaser from '@/components/home/GalleryTeaser';
import VeteranStory from '@/components/home/VeteranStory';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CustomOrderBand />
      <GalleryTeaser />
      <VeteranStory />
    </>
  );
}
```

- [ ] **Step 6: Run dev server — verify full homepage renders**

```bash
npm run dev
```

Open http://localhost:3000. Expected: hero → featured products (or empty if no API key yet) → CTA band → gallery teaser → veteran story → footer.

- [ ] **Step 7: Commit**

```bash
git add components/home/ config/gallery.config.ts app/page.tsx
git commit -m "feat: complete homepage sections and assembly"
```

---

## Task 9: Shop Page

**Files:**
- Create: `components/shop/ProductGrid.tsx`
- Create: `app/shop/page.tsx`

- [ ] **Step 1: Create components/shop/ProductGrid.tsx**

```tsx
'use client';
import { useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import type { EtsyListing, EtsyShopSection } from '@/types/etsy';

interface Props {
  listings: EtsyListing[];
  sections: EtsyShopSection[];
}

export default function ProductGrid({ listings, sections }: Props) {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const filtered =
    activeSection === null
      ? listings
      : listings.filter((l) => l.shop_section_id === activeSection);

  return (
    <div>
      {sections.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveSection(null)}
            className={`font-body text-sm px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
              activeSection === null
                ? 'bg-navy text-white border-navy'
                : 'border-navy/30 text-navy/70 hover:border-navy hover:text-navy'
            }`}
          >
            All
          </button>
          {sections.map((s) => (
            <button
              key={s.shop_section_id}
              onClick={() => setActiveSection(s.shop_section_id)}
              className={`font-body text-sm px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
                activeSection === s.shop_section_id
                  ? 'bg-navy text-white border-navy'
                  : 'border-navy/30 text-navy/70 hover:border-navy hover:text-navy'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="font-body text-brand-text/50 text-center py-16">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((listing) => (
            <ProductCard key={listing.listing_id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create app/shop/page.tsx**

```tsx
import { getActiveListings, getShopSections } from '@/lib/etsy';
import ProductGrid from '@/components/shop/ProductGrid';

export const revalidate = 3600;

export default async function ShopPage() {
  const shopId = process.env.ETSY_SHOP_ID!;
  let listings = [];
  let sections = [];

  try {
    [listings, sections] = await Promise.all([
      getActiveListings(shopId),
      getShopSections(shopId),
    ]);
  } catch {
    // Serve empty state on API failure
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading font-bold text-navy text-4xl mb-2">Shop</h1>
      <p className="font-body text-brand-text/60 mb-8">
        All products fulfilled through our{' '}
        <a
          href="https://www.etsy.com/shop/tndslaserengraving"
          target="_blank"
          rel="noopener noreferrer"
          className="text-steel hover:text-navy underline"
        >
          Etsy shop
        </a>
        .
      </p>
      <ProductGrid listings={listings} sections={sections} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/shop/ProductGrid.tsx app/shop/page.tsx
git commit -m "feat: add shop page with section filtering"
```

---

## Task 10: Listing Detail Page

**Files:**
- Create: `app/shop/[listingId]/page.tsx`

- [ ] **Step 1: Create app/shop/[listingId]/page.tsx**

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { getListing, getListingImages, formatPrice } from '@/lib/etsy';

export const revalidate = 3600;

interface Props {
  params: Promise<{ listingId: string }>;
}

export default async function ListingPage({ params }: Props) {
  const { listingId } = await params;

  let listing, images;
  try {
    [listing, images] = await Promise.all([
      getListing(listingId),
      getListingImages(listingId),
    ]);
  } catch {
    notFound();
  }

  if (listing.state !== 'active') notFound();

  const primaryImage = images[0];
  const price = formatPrice(listing.price);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 font-body text-sm text-steel hover:text-navy transition-colors mb-8"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          {primaryImage ? (
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src={primaryImage.url_fullxfull}
                alt={primaryImage.alt_text ?? listing.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="aspect-square bg-navy/10 rounded-xl flex items-center justify-center">
              <span className="font-body text-navy/30">No image</span>
            </div>
          )}

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.slice(1).map((img) => (
                <div
                  key={img.listing_image_id}
                  className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden"
                >
                  <Image
                    src={img.url_170x135}
                    alt={img.alt_text ?? listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-heading font-bold text-navy text-2xl sm:text-3xl mb-3">
            {listing.title}
          </h1>
          <p className="font-body font-bold text-2xl text-patriot-red mb-6">{price}</p>

          <p className="font-body text-brand-text/75 text-base leading-relaxed mb-8 whitespace-pre-line">
            {listing.description}
          </p>

          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-patriot-red hover:bg-patriot-red-dark text-white font-body font-semibold px-6 py-3 rounded-md transition-colors duration-150 cursor-pointer mb-4"
          >
            Buy on Etsy <ExternalLink size={16} aria-hidden="true" />
          </a>

          <div className="mt-4">
            <Link
              href="/custom-order"
              className="font-body text-sm text-steel hover:text-navy underline"
            >
              Need something custom? Start an order →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/shop/
git commit -m "feat: add listing detail page with image gallery"
```

---

## Task 11: Gallery Page

**Files:**
- Create: `components/gallery/GalleryGrid.tsx`
- Create: `app/gallery/page.tsx`

- [ ] **Step 1: Create components/gallery/GalleryGrid.tsx**

```tsx
import Image from 'next/image';
import type { GalleryImage } from '@/config/gallery.config';

interface Props {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: Props) {
  return (
    <div
      className="columns-2 md:columns-3 gap-3 space-y-3"
      role="list"
      aria-label="Gallery of laser engraving work"
    >
      {images.map((img) => (
        <div
          key={img.id}
          className="relative break-inside-avoid rounded-lg overflow-hidden"
          role="listitem"
        >
          <Image
            src={img.url}
            alt={img.alt}
            width={600}
            height={600}
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create app/gallery/page.tsx**

```tsx
import GalleryGrid from '@/components/gallery/GalleryGrid';
import { galleryImages } from '@/config/gallery.config';

export default function GalleryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading font-bold text-navy text-4xl mb-2">Gallery</h1>
      <p className="font-body text-brand-text/60 mb-10">
        A look at some of our custom work.
      </p>
      <GalleryGrid images={galleryImages} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/gallery/ app/gallery/
git commit -m "feat: add gallery page with masonry grid"
```

---

## Task 12: About + Contact Pages

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Create app/about/page.tsx**

```tsx
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
```

- [ ] **Step 2: Create app/contact/page.tsx**

```tsx
import { Mail, ExternalLink, Instagram, Facebook } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading font-bold text-navy text-4xl mb-2">Contact Us</h1>
      <p className="font-body text-brand-text/60 mb-10">
        Questions, custom requests, or just want to say hello — we'd love to hear from you.
      </p>

      <div className="space-y-6">
        <a
          href="mailto:topnotchdesignstudio@email.com"
          className="flex items-center gap-4 p-5 rounded-xl bg-navy/5 hover:bg-navy/10 transition-colors group"
        >
          <Mail className="text-patriot-red flex-shrink-0" size={24} aria-hidden="true" />
          <div>
            <p className="font-body font-semibold text-navy text-sm">Email</p>
            <p className="font-body text-brand-text/70 text-sm group-hover:text-navy transition-colors">
              topnotchdesignstudio@email.com
            </p>
          </div>
        </a>

        <a
          href="https://www.etsy.com/shop/tndslaserengraving"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 rounded-xl bg-navy/5 hover:bg-navy/10 transition-colors group"
        >
          <ExternalLink className="text-patriot-red flex-shrink-0" size={24} aria-hidden="true" />
          <div>
            <p className="font-body font-semibold text-navy text-sm">Etsy Shop</p>
            <p className="font-body text-brand-text/70 text-sm group-hover:text-navy transition-colors">
              etsy.com/shop/tndslaserengraving
            </p>
          </div>
        </a>

        <div className="flex items-center gap-4 p-5 rounded-xl bg-navy/5">
          <Instagram className="text-patriot-red flex-shrink-0" size={24} aria-hidden="true" />
          <div>
            <p className="font-body font-semibold text-navy text-sm">Instagram</p>
            <p className="font-body text-brand-text/70 text-sm">Coming soon</p>
          </div>
        </div>
      </div>

      <div className="mt-10 p-6 bg-navy rounded-xl text-center">
        <p className="font-body text-white/80 text-sm mb-3">
          Ready to place a custom order?
        </p>
        <a
          href="/custom-order"
          className="inline-block bg-patriot-red hover:bg-patriot-red-dark text-white font-body font-semibold px-6 py-2.5 rounded-md transition-colors text-sm cursor-pointer"
        >
          Start Custom Order
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/about/ app/contact/
git commit -m "feat: add about and contact pages"
```

---

## Task 13: Custom Order Wizard

**Files:**
- Create: `components/custom-order/WizardNavigation.tsx`
- Create: `components/custom-order/steps/Step1ProductType.tsx`
- Create: `components/custom-order/steps/Step2Details.tsx`
- Create: `components/custom-order/steps/Step3Reference.tsx`
- Create: `components/custom-order/steps/Step4Contact.tsx`
- Create: `components/custom-order/OrderWizard.tsx`
- Create: `app/custom-order/page.tsx`
- Create: `tests/components/OrderWizard.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/OrderWizard.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderWizard from '@/components/custom-order/OrderWizard';

describe('OrderWizard', () => {
  it('renders step 1 on mount', () => {
    render(<OrderWizard />);
    expect(screen.getByText('What are you looking to engrave?')).toBeInTheDocument();
  });

  it('Next button is disabled when no product type selected', () => {
    render(<OrderWizard />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('Next button enables after selecting a product type', () => {
    render(<OrderWizard />);
    fireEvent.click(screen.getByText('Cutting Board'));
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('advances to step 2 on Next click', () => {
    render(<OrderWizard />);
    fireEvent.click(screen.getByText('Cutting Board'));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Tell us about your engraving')).toBeInTheDocument();
  });

  it('Back button returns to step 1 from step 2', () => {
    render(<OrderWizard />);
    fireEvent.click(screen.getByText('Cutting Board'));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText('What are you looking to engrave?')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run tests/components/OrderWizard.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/custom-order/OrderWizard'`

- [ ] **Step 3: Create components/custom-order/WizardNavigation.tsx**

```tsx
interface Props {
  step: number;
  canAdvance: boolean;
  onBack: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isLastStep: boolean;
  isSubmitting?: boolean;
}

export default function WizardNavigation({
  step,
  canAdvance,
  onBack,
  onNext,
  onSubmit,
  isLastStep,
  isSubmitting = false,
}: Props) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy/10">
      {step > 1 ? (
        <button
          onClick={onBack}
          className="font-body text-sm font-medium text-navy/60 hover:text-navy transition-colors cursor-pointer"
        >
          ← Back
        </button>
      ) : (
        <div />
      )}

      {isLastStep ? (
        <button
          onClick={onSubmit}
          disabled={!canAdvance || isSubmitting}
          className="bg-patriot-red hover:bg-patriot-red-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-semibold px-6 py-2.5 rounded-md transition-colors cursor-pointer"
        >
          {isSubmitting ? 'Sending…' : 'Submit Request'}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="bg-navy hover:bg-navy-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-body font-semibold px-6 py-2.5 rounded-md transition-colors cursor-pointer"
        >
          Next →
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create components/custom-order/steps/Step1ProductType.tsx**

```tsx
import type { WizardState, ProductType } from '@/types/wizard';
import { PRODUCT_TYPE_LABELS } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
}

const PRODUCT_TYPES = Object.entries(PRODUCT_TYPE_LABELS) as [ProductType, string][];

export default function Step1ProductType({ state, update }: Props) {
  return (
    <div>
      <h2 className="font-heading font-bold text-navy text-2xl mb-2">
        What are you looking to engrave?
      </h2>
      <p className="font-body text-brand-text/60 text-sm mb-6">Select a product type to continue.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PRODUCT_TYPES.map(([value, label]) => (
          <button
            key={value}
            onClick={() => update({ productType: value })}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
              state.productType === value
                ? 'border-patriot-red bg-patriot-red/5 text-navy'
                : 'border-navy/15 hover:border-navy/40 text-brand-text/70'
            }`}
          >
            <span className="font-body font-semibold text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create components/custom-order/steps/Step2Details.tsx**

```tsx
import type { WizardState, DesignStyle } from '@/types/wizard';
import { SIZE_OPTIONS } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
}

const DESIGN_STYLES: { value: DesignStyle; label: string; desc: string }[] = [
  { value: 'text', label: 'Simple Text', desc: 'Names, dates, quotes' },
  { value: 'artwork', label: 'Custom Artwork', desc: 'I'll describe my design' },
  { value: 'upload', label: 'Upload My Own', desc: 'I have a file ready' },
];

export default function Step2Details({ state, update }: Props) {
  const sizeOptions =
    state.productType && state.productType in SIZE_OPTIONS
      ? SIZE_OPTIONS[state.productType as keyof typeof SIZE_OPTIONS]
      : ['Custom'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-navy text-2xl mb-1">
          Tell us about your engraving
        </h2>
        <p className="font-body text-brand-text/60 text-sm">Fill in as much as you know — we'll follow up with questions.</p>
      </div>

      <div>
        <label htmlFor="engraveText" className="font-body font-semibold text-navy text-sm block mb-1.5">
          Text to Engrave <span className="text-patriot-red">*</span>
        </label>
        <input
          id="engraveText"
          type="text"
          value={state.engraveText}
          onChange={(e) => update({ engraveText: e.target.value })}
          placeholder="e.g. The Johnson Family · Est. 2019"
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="size" className="font-body font-semibold text-navy text-sm block mb-1.5">
            Size <span className="text-patriot-red">*</span>
          </label>
          <select
            id="size"
            value={state.size}
            onChange={(e) => update({ size: e.target.value })}
            className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy bg-white cursor-pointer"
          >
            <option value="">Select…</option>
            {sizeOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="font-body font-semibold text-navy text-sm block mb-1.5">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={500}
            value={state.quantity}
            onChange={(e) => update({ quantity: Math.max(1, Number(e.target.value)) })}
            className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>
      </div>

      {(state.productType === 'cutting-board' || state.productType === 'granite') && (
        <div>
          <label htmlFor="material" className="font-body font-semibold text-navy text-sm block mb-1.5">
            Material Preference
          </label>
          <input
            id="material"
            type="text"
            value={state.material}
            onChange={(e) => update({ material: e.target.value })}
            placeholder="e.g. Maple, Walnut, Cherry…"
            className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>
      )}

      <div>
        <p className="font-body font-semibold text-navy text-sm mb-2">Design Style</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DESIGN_STYLES.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => update({ designStyle: value })}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                state.designStyle === value
                  ? 'border-patriot-red bg-patriot-red/5'
                  : 'border-navy/15 hover:border-navy/40'
              }`}
            >
              <p className="font-body font-semibold text-navy text-sm">{label}</p>
              <p className="font-body text-brand-text/60 text-xs mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create components/custom-order/steps/Step3Reference.tsx**

```tsx
import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import type { WizardState } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
}

export default function Step3Reference({ state, update }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    update({ referenceImage: file });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-navy text-2xl mb-1">
          Reference &amp; Notes
        </h2>
        <p className="font-body text-brand-text/60 text-sm">
          Optional — upload a logo, photo, or design idea. Add any extra details below.
        </p>
      </div>

      <div>
        <p className="font-body font-semibold text-navy text-sm mb-2">Reference Image (optional)</p>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-navy/20 rounded-xl p-8 text-center cursor-pointer hover:border-navy/40 transition-colors"
        >
          {state.referenceImage ? (
            <div className="flex items-center justify-center gap-3">
              <span className="font-body text-sm text-navy font-medium">
                {state.referenceImage.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  update({ referenceImage: null });
                }}
                className="text-patriot-red hover:text-patriot-red-dark cursor-pointer"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto text-navy/30 mb-2" size={28} aria-hidden="true" />
              <p className="font-body text-sm text-navy/50">
                Drag &amp; drop or <span className="text-steel underline">browse</span>
              </p>
              <p className="font-body text-xs text-navy/30 mt-1">JPG, PNG, SVG, PDF up to 10MB</p>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf,.svg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      <div>
        <label htmlFor="notes" className="font-body font-semibold text-navy text-sm block mb-1.5">
          Additional Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={state.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Any other details, font preferences, inspiration, deadline…"
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy resize-none"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create components/custom-order/steps/Step4Contact.tsx**

```tsx
import type { WizardState, ContactMethod } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
  submitError: string;
}

export default function Step4Contact({ state, update, submitError }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading font-bold text-navy text-2xl mb-1">
          How can we reach you?
        </h2>
        <p className="font-body text-brand-text/60 text-sm">
          We'll follow up within 24–48 hours.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="font-body font-semibold text-navy text-sm block mb-1.5">
          Full Name <span className="text-patriot-red">*</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={state.name}
          onChange={(e) => update({ name: e.target.value })}
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <label htmlFor="email" className="font-body font-semibold text-navy text-sm block mb-1.5">
          Email <span className="text-patriot-red">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={state.email}
          onChange={(e) => update({ email: e.target.value })}
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <label htmlFor="phone" className="font-body font-semibold text-navy text-sm block mb-1.5">
          Phone <span className="font-normal text-navy/40">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={state.phone}
          onChange={(e) => update({ phone: e.target.value })}
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <p className="font-body font-semibold text-navy text-sm mb-2">Preferred Contact Method</p>
        <div className="flex gap-3">
          {(['email', 'phone'] as ContactMethod[]).map((method) => (
            <button
              key={method}
              onClick={() => update({ contactMethod: method })}
              className={`px-4 py-2 rounded-lg border-2 font-body text-sm font-medium transition-all cursor-pointer capitalize ${
                state.contactMethod === method
                  ? 'border-patriot-red bg-patriot-red/5 text-navy'
                  : 'border-navy/15 text-navy/60 hover:border-navy/40'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {submitError && (
        <div role="alert" className="p-3 rounded-lg bg-patriot-red/10 border border-patriot-red/20">
          <p className="font-body text-sm text-patriot-red">{submitError}</p>
          <a href="mailto:topnotchdesignstudio@email.com" className="font-body text-xs text-steel underline mt-1 block">
            Or email us directly
          </a>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Create components/custom-order/OrderWizard.tsx**

```tsx
'use client';
import { useState } from 'react';
import type { WizardState } from '@/types/wizard';
import { initialWizardState } from '@/types/wizard';
import Step1ProductType from './steps/Step1ProductType';
import Step2Details from './steps/Step2Details';
import Step3Reference from './steps/Step3Reference';
import Step4Contact from './steps/Step4Contact';
import WizardNavigation from './WizardNavigation';
import Link from 'next/link';

const STEP_LABELS = ['Product Type', 'Details', 'Reference', 'Contact'];

function canAdvance(state: WizardState): boolean {
  if (state.step === 1) return state.productType !== '';
  if (state.step === 2) return state.engraveText.trim() !== '' && state.size !== '';
  if (state.step === 3) return true;
  if (state.step === 4) return state.name.trim() !== '' && state.email.trim() !== '';
  return false;
}

export default function OrderWizard() {
  const [state, setState] = useState<WizardState>(initialWizardState);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(partial: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function next() {
    setState((prev) => ({
      ...prev,
      step: Math.min(4, prev.step + 1) as WizardState['step'],
    }));
  }

  function back() {
    setSubmitError('');
    setState((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1) as WizardState['step'],
    }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const formData = new FormData();
      (Object.entries(state) as [string, unknown][]).forEach(([k, v]) => {
        if (v instanceof File) formData.append(k, v);
        else if (v !== null && v !== undefined) formData.append(k, String(v));
      });
      const res = await fetch('/api/custom-order', { method: 'POST', body: formData });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitError('Something went wrong. Please try again or contact us directly.');
      }
    } catch {
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="text-4xl mb-4" aria-hidden="true">✅</div>
        <h2 className="font-heading font-bold text-navy text-3xl mb-3">Request Received!</h2>
        <p className="font-body text-brand-text/70 text-base mb-6">
          We'll be in touch within 24–48 hours.
        </p>
        <Link href="/shop" className="font-body text-steel hover:text-navy underline text-sm">
          Browse the shop while you wait →
        </Link>
      </div>
    );
  }

  const progress = ((state.step - 1) / 3) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={`font-body text-xs font-medium ${i + 1 <= state.step ? 'text-patriot-red' : 'text-brand-text/30'}`}
            >
              {label}
            </span>
          ))}
        </div>
        <div
          className="h-1.5 bg-navy/10 rounded-full"
          role="progressbar"
          aria-valuenow={state.step}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Step ${state.step} of 4`}
        >
          <div
            className="h-full bg-patriot-red rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {state.step === 1 && <Step1ProductType state={state} update={update} />}
      {state.step === 2 && <Step2Details state={state} update={update} />}
      {state.step === 3 && <Step3Reference state={state} update={update} />}
      {state.step === 4 && (
        <Step4Contact state={state} update={update} submitError={submitError} />
      )}

      <WizardNavigation
        step={state.step}
        canAdvance={canAdvance(state)}
        onBack={back}
        onNext={state.step < 4 ? next : undefined}
        onSubmit={state.step === 4 ? handleSubmit : undefined}
        isLastStep={state.step === 4}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
```

- [ ] **Step 9: Create app/custom-order/page.tsx**

```tsx
import OrderWizard from '@/components/custom-order/OrderWizard';

export const metadata = {
  title: 'Custom Order | Top Notch Design Studio',
};

export default function CustomOrderPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="bg-navy py-10 px-4 text-center">
        <h1 className="font-heading font-bold text-white text-3xl sm:text-4xl">
          Start a Custom Order
        </h1>
        <p className="font-body text-white/70 mt-2 text-sm">
          Tell us what you need and we'll bring it to life.
        </p>
      </div>
      <OrderWizard />
    </div>
  );
}
```

- [ ] **Step 10: Run tests — verify they pass**

```bash
npx vitest run tests/components/OrderWizard.test.tsx
```

Expected: PASS — 5 tests passing.

- [ ] **Step 11: Commit**

```bash
git add components/custom-order/ app/custom-order/ tests/components/
git commit -m "feat: add 4-step custom order wizard with tests"
```

---

## Task 14: Custom Order API Route + Email

**Files:**
- Create: `lib/resend.ts`
- Create: `app/api/custom-order/route.ts`
- Create: `tests/api/custom-order.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/api/custom-order.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ id: 'email-123' }) },
  })),
}));

const makeFormData = (fields: Record<string, string>) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  return fd;
};

describe('POST /api/custom-order', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.OWNER_EMAIL = 'owner@test.com';
  });

  it('returns 200 on valid submission', async () => {
    const { POST } = await import('@/app/api/custom-order/route');
    const fd = makeFormData({
      name: 'John Doe',
      email: 'john@example.com',
      productType: 'cutting-board',
      engraveText: 'The Doe Family',
      size: '12x18"',
      quantity: '1',
      designStyle: 'text',
      notes: '',
      phone: '',
      contactMethod: 'email',
    });
    const req = new Request('http://localhost/api/custom-order', {
      method: 'POST',
      body: fd,
    });
    const res = await POST(req as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('returns 400 when name is missing', async () => {
    const { POST } = await import('@/app/api/custom-order/route');
    const fd = makeFormData({ email: 'john@example.com', productType: 'cutting-board' });
    const req = new Request('http://localhost/api/custom-order', { method: 'POST', body: fd });
    const res = await POST(req as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(400);
  });

  it('returns 400 when email is missing', async () => {
    const { POST } = await import('@/app/api/custom-order/route');
    const fd = makeFormData({ name: 'John', productType: 'cutting-board' });
    const req = new Request('http://localhost/api/custom-order', { method: 'POST', body: fd });
    const res = await POST(req as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run tests/api/custom-order.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create lib/resend.ts**

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderData {
  name: string;
  email: string;
  productType: string;
  engraveText: string;
  size: string;
  quantity: number;
  material: string;
  designStyle: string;
  notes: string;
  phone: string;
  contactMethod: string;
  referenceImage: File | null;
}

export async function sendOrderEmail(data: OrderData): Promise<void> {
  const rows = [
    ['Product Type', data.productType],
    ['Text to Engrave', data.engraveText],
    ['Size', data.size],
    ['Quantity', String(data.quantity)],
    ['Material', data.material || 'Not specified'],
    ['Design Style', data.designStyle],
    ['Notes', data.notes || 'None'],
    ['Phone', data.phone || 'Not provided'],
    ['Preferred Contact', data.contactMethod],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${k}:</td><td>${v}</td></tr>`)
    .join('');

  const html = `
    <h2 style="color:#1B2E4B">New Custom Order from ${data.name}</h2>
    <p><strong>Reply to:</strong> ${data.email}</p>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows}
    </table>
  `;

  const attachments: { filename: string; content: Buffer }[] = [];
  if (data.referenceImage) {
    const buffer = await data.referenceImage.arrayBuffer();
    attachments.push({ filename: data.referenceImage.name, content: Buffer.from(buffer) });
  }

  await resend.emails.send({
    from: 'orders@topnotchdesignstudio.com',
    to: process.env.OWNER_EMAIL!,
    replyTo: data.email,
    subject: `New Custom Order — ${data.productType} — ${data.name}`,
    html,
    attachments,
  });
}
```

> **Note:** The `from` address requires a verified domain in Resend. Until the domain is set up, use `onboarding@resend.dev` for testing.

- [ ] **Step 4: Create app/api/custom-order/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const productType = (formData.get('productType') as string | null) ?? '';

  if (!name || !email || !productType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await sendOrderEmail({
      name,
      email,
      productType,
      engraveText: (formData.get('engraveText') as string) ?? '',
      size: (formData.get('size') as string) ?? '',
      quantity: Number(formData.get('quantity') ?? 1),
      material: (formData.get('material') as string) ?? '',
      designStyle: (formData.get('designStyle') as string) ?? '',
      notes: (formData.get('notes') as string) ?? '',
      phone: (formData.get('phone') as string) ?? '',
      contactMethod: (formData.get('contactMethod') as string) ?? 'email',
      referenceImage: formData.get('referenceImage') as File | null,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Order email failed:', err);
    return NextResponse.json({ error: 'Failed to send order' }, { status: 500 });
  }
}
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
npx vitest run tests/api/custom-order.test.ts
```

Expected: PASS — 3 tests passing.

- [ ] **Step 6: Commit**

```bash
git add lib/resend.ts app/api/ tests/api/
git commit -m "feat: add custom order API route with Resend email and tests"
```

---

## Task 15: Next.js Config + Deployment Prep

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Replace next.config.ts**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.etsystatic.com' },
      { protocol: 'https', hostname: 'v.etsystatic.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors. Fix any TypeScript errors before continuing.

- [ ] **Step 4: Deploy to Vercel**

```bash
npx vercel --prod
```

When prompted, set environment variables in the Vercel dashboard:
- `ETSY_API_KEY`
- `ETSY_SHOP_ID`
- `RESEND_API_KEY`
- `OWNER_EMAIL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

- [ ] **Step 5: Commit**

```bash
git add next.config.ts
git commit -m "feat: configure image domains and finalize deployment"
```

---

## Post-Launch Checklist

- [ ] Upload gallery photos to Cloudinary under `tnds/gallery-1.jpg` through `gallery-6.jpg`
- [ ] Update Instagram/Facebook links in `Footer.tsx` and `contact/page.tsx` once accounts are created
- [ ] Replace owner photo placeholder in `VeteranStory.tsx` with actual photo
- [ ] Update email address in `contact/page.tsx` and `lib/resend.ts` once domain email is set up
- [ ] Verify Resend `from` address with custom domain in Resend dashboard
- [ ] Register and point domain to Vercel deployment
- [ ] Test full custom order flow end-to-end on production
