# Top Notch Design Studio — Website Design Spec
**Date:** 2026-04-26
**Project:** Top Notch Design Studio Laser Engraving (tndslaserengraving)
**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Etsy v3 API · 21st.dev components · Vercel

---

## Overview

A branded marketing and commerce site for a veteran-owned laser engraving business. The site serves three jobs simultaneously:
1. **Brand presence** — communicate quality, precision, and veteran identity
2. **Product showcase** — live Etsy listings pulled via API
3. **Custom order intake** — multi-step wizard for personalized engraving requests

Checkout remains on Etsy. The site acts as a premium branded front-door over the existing Etsy shop.

---

## Design System

| Token | Value |
|---|---|
| Primary | Deep Navy `#1B2E4B` |
| Accent | Patriot Red `#DC2626` |
| Background | Near-white `#F8FAFC` |
| Steel Blue | `#2563EB` |
| Text | `#1E293B` |
| White | `#FFFFFF` |

**Typography**
- Headings: **Rubik** (bold, sharp — communicates precision)
- Body: **Nunito Sans** (readable, friendly)
- Google Fonts import included in layout

**Style:** Clean modern with subtle glassmorphism on cards (backdrop-blur 10–20px, 1px rgba-white border, Z-depth). Patriotic flag texture overlay at low opacity on hero.

**Icons:** Lucide React (SVG only, no emoji)

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/shop` | Product gallery (Etsy listings, filterable by section) |
| `/shop/[listingId]` | Individual listing detail |
| `/custom-order` | Multi-step custom order wizard |
| `/gallery` | Portfolio/showcase of completed work |
| `/about` | Veteran story, brand values |
| `/contact` | Contact form + social/Etsy links |

---

## Homepage Layout

1. **Hero** — Full-width, near-full-height. Deep navy bg + low-opacity flag texture overlay. Rubik heading: *"Precision Crafted. Veteran Built."* Two CTAs: `Start Custom Order` (red, primary) + `Shop Products` (white outline). Veteran-Owned badge below CTAs.
2. **Featured Products Strip** — 3–4 Etsy listings via API. Glassmorphism product cards with name, photo, price, "View on Etsy" link.
3. **Custom Order CTA Band** — Full-width navy-to-red gradient. Headline: *"Have something specific in mind?"* Red CTA button.
4. **Gallery Teaser** — Masonry grid of 6 portfolio photos. Dark background so engraved pieces pop.
5. **Veteran Story Block** — Split layout. Headline: *"Built on Service. Crafted with Pride."* Short paragraph on background and mission. Red left-border accent.
6. **Footer** — Navy bg. Logo, nav, Etsy link, socials, Veteran-Owned badge, copyright.

---

## Custom Order Wizard

4-step flow with top progress bar. Back/Next navigation. Required fields block advancement; back is always free.

### Step 1 — Product Type
Visual card grid. Single selection:
- Cutting Board
- Business Cards
- Granite Cutting Board
- Acrylic
- Custom / Other

### Step 2 — Personalization Details
Fields adapt to Step 1 selection:
- Text to engrave (names, quotes, dates)
- Size (dropdown: common sizes + "Custom")
- Quantity
- Material/wood preference (if applicable)
- Design style: Simple text · Custom artwork · Upload my own

### Step 3 — Reference & Notes
- Image upload (drag-and-drop + mobile camera picker)
- Free-text notes field

### Step 4 — Contact & Submit
- Name, email, phone (optional)
- Preferred contact method
- Submit → Next.js API route sends email via Resend
- Confirmation screen: "We'll be in touch within 24–48 hours" + social/Etsy links

**Email service:** Resend (free tier: 3,000 emails/month)
**File uploads:** Vercel Blob (temporary storage, attached to email)

---

## Etsy API Integration

**Auth:** API key (keystring) — read-only public shop, no OAuth user flow needed.
**Env vars:** `ETSY_API_KEY`, `ETSY_SHOP_ID`

| Data | Endpoint | Cache |
|---|---|---|
| Shop listings | `GET /v3/application/shops/{shop_id}/listings` | ISR 1hr |
| Listing images | `GET /v3/application/listings/{listing_id}/images` | ISR 1hr |
| Shop sections | `GET /v3/application/shops/{shop_id}/sections` | ISR 24hr |
| Single listing | `GET /v3/application/listings/{listing_id}` | ISR 1hr |

**Gallery page:** Static — photos uploaded manually to Cloudinary (already configured). Not Etsy-powered; gives full curatorial control. Images referenced by URL in a local `gallery.config.ts` file.

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Etsy API down / rate-limited | Serve stale ISR cache silently — never a broken page |
| Listing deleted on Etsy | `notFound()` on dynamic route → 404 page |
| Custom order email fails | Friendly retry message + fallback `mailto:` link |
| Image upload fails | Inline error with retry — order can still submit without attachment |

---

## Key Constraints & Decisions

- **Checkout stays on Etsy** — no payment processing needed on this site
- **Gallery is manually curated** — not synced from Etsy, giving control over best-work showcase
- **Veteran identity is a brand pillar**, not a footnote — drives hero copy, about section, and footer
- **ISR over SSR** for Etsy data — fast page loads, low API usage, fresh enough for a small shop
- **21st.dev MCP** used for UI component generation throughout build
