# Review System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-tier customer review system: verified purchase reviews (HMAC token, auto-approved) and public reviews (admin-moderated), with display on a public reviews page and the site homepage.

**Architecture:** Pure Next.js App Router with Supabase (already provisioned). Server components read directly from Supabase using the anon key; client components submit through Next.js API routes which use the service-role key. No client-side Supabase access — all DB writes go through API routes.

**Tech Stack:** Next.js 14.2.5 App Router, Supabase (`@supabase/supabase-js`), Node.js `crypto` (HMAC), TypeScript, Vitest

---

## Required Environment Variables

All already set in Vercel and `.env.local`:
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — read-only public key (used in server components)
- `SUPABASE_SERVICE_ROLE_KEY` — bypasses RLS (used in API routes only)
- `ADMIN_SECRET` — shared secret for admin API auth
- `REVIEW_HMAC_SECRET` — secret for signing verified purchase tokens

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Install | `@supabase/supabase-js` | Supabase client library |
| Create | `lib/types.ts` | `Review` type shared across app |
| Create | `lib/supabase.ts` | Anon Supabase client (server components) |
| Create | `lib/supabase-admin.ts` | Service-role client (API routes only) |
| Create | `lib/admin-sig.ts` | Validate `Authorization: Bearer {ADMIN_SECRET}` |
| Create | `lib/review-token.ts` | HMAC token generate + verify |
| Create | `app/api/reviews/route.ts` | POST: submit review (public + verified) |
| Create | `app/api/admin/reviews/route.ts` | GET: list pending reviews |
| Create | `app/api/admin/reviews/[id]/route.ts` | POST: approve or reject a review |
| Create | `app/reviews/page.tsx` | Public reviews listing page |
| Create | `app/reviews/ReviewSubmitForm.tsx` | Client form: public review submission |
| Create | `app/reviews/[token]/page.tsx` | Verified purchase review page (validates token server-side) |
| Create | `app/reviews/[token]/ReviewForm.tsx` | Client form: verified review submission |
| Create | `app/admin/reviews/page.tsx` | Admin moderation UI (approve/reject queue) |
| Create | `components/home/ReviewsSection.tsx` | Homepage: 3 latest approved reviews |
| Modify | `app/page.tsx` | Add `<ReviewsSection />` after `<VeteranStory />` |

---

## Task 1: Install Supabase + Shared Types + Clients

**Files:**
- Create: `lib/types.ts`
- Create: `lib/supabase.ts`
- Create: `lib/supabase-admin.ts`

- [ ] **Step 1: Install the Supabase client library**

```
npm install @supabase/supabase-js
```

Expected: `@supabase/supabase-js` appears in `package.json` dependencies.

- [ ] **Step 2: Create `lib/types.ts`**

```typescript
export type Review = {
  id: string;
  product_handle: string;
  author_name: string;
  rating: number;
  body: string;
  verified_purchase: boolean;
  approved: boolean;
  token_used: string | null;
  created_at: string;
};
```

- [ ] **Step 3: Create `lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);
```

- [ ] **Step 4: Create `lib/supabase-admin.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
```

- [ ] **Step 5: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors from the new files (ignore pre-existing errors in `tests/components/OrderWizard.test.tsx`).

- [ ] **Step 6: Commit**

```
git add package.json package-lock.json lib/types.ts lib/supabase.ts lib/supabase-admin.ts
git commit -m "feat: install supabase and add shared clients + Review type"
```

---

## Task 2: Admin Signature Utility (TDD)

**Files:**
- Create: `lib/admin-sig.ts`
- Create: `tests/lib/admin-sig.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/lib/admin-sig.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateAdminRequest } from '@/lib/admin-sig';

describe('validateAdminRequest', () => {
  beforeEach(() => vi.stubEnv('ADMIN_SECRET', 'test-secret'));
  afterEach(() => vi.unstubAllEnvs());

  it('returns true for correct Bearer secret', () => {
    const req = new Request('http://localhost', {
      headers: { Authorization: 'Bearer test-secret' },
    });
    expect(validateAdminRequest(req)).toBe(true);
  });

  it('returns false for wrong secret', () => {
    const req = new Request('http://localhost', {
      headers: { Authorization: 'Bearer wrong' },
    });
    expect(validateAdminRequest(req)).toBe(false);
  });

  it('returns false when Authorization header is missing', () => {
    const req = new Request('http://localhost');
    expect(validateAdminRequest(req)).toBe(false);
  });

  it('returns false when header lacks Bearer prefix', () => {
    const req = new Request('http://localhost', {
      headers: { Authorization: 'test-secret' },
    });
    expect(validateAdminRequest(req)).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```
npx vitest run tests/lib/admin-sig.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/admin-sig'`

- [ ] **Step 3: Create `lib/admin-sig.ts`**

```typescript
export function validateAdminRequest(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  return authHeader.slice(7) === process.env.ADMIN_SECRET;
}
```

- [ ] **Step 4: Run tests — verify they pass**

```
npx vitest run tests/lib/admin-sig.test.ts
```

Expected: 4/4 PASS.

- [ ] **Step 5: Commit**

```
git add lib/admin-sig.ts tests/lib/admin-sig.test.ts
git commit -m "feat: add admin signature validation utility"
```

---

## Task 3: Review HMAC Token Utility (TDD)

**Files:**
- Create: `lib/review-token.ts`
- Create: `tests/lib/review-token.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/lib/review-token.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateToken, verifyToken } from '@/lib/review-token';

describe('review token', () => {
  beforeEach(() => vi.stubEnv('REVIEW_HMAC_SECRET', 'test-hmac-secret'));
  afterEach(() => vi.unstubAllEnvs());

  it('generates a 64-char hex string', () => {
    const token = generateToken('order1', 'board', 'a@b.com');
    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });

  it('same inputs always produce same token', () => {
    const t1 = generateToken('order1', 'board', 'a@b.com');
    const t2 = generateToken('order1', 'board', 'a@b.com');
    expect(t1).toBe(t2);
  });

  it('different order ID produces different token', () => {
    const t1 = generateToken('order1', 'board', 'a@b.com');
    const t2 = generateToken('order2', 'board', 'a@b.com');
    expect(t1).not.toBe(t2);
  });

  it('verifies a valid token', () => {
    const token = generateToken('order1', 'board', 'a@b.com');
    expect(verifyToken(token, 'order1', 'board', 'a@b.com')).toBe(true);
  });

  it('rejects tampered token', () => {
    expect(verifyToken('a'.repeat(64), 'order1', 'board', 'a@b.com')).toBe(false);
  });

  it('rejects when order ID differs', () => {
    const token = generateToken('order1', 'board', 'a@b.com');
    expect(verifyToken(token, 'order2', 'board', 'a@b.com')).toBe(false);
  });

  it('returns false for invalid hex without throwing', () => {
    expect(verifyToken('not-hex!!', 'order1', 'board', 'a@b.com')).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```
npx vitest run tests/lib/review-token.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/review-token'`

- [ ] **Step 3: Create `lib/review-token.ts`**

```typescript
import { createHmac, timingSafeEqual } from 'crypto';

export function generateToken(orderId: string, productHandle: string, email: string): string {
  return createHmac('sha256', process.env.REVIEW_HMAC_SECRET!)
    .update(`${orderId}:${productHandle}:${email}`)
    .digest('hex');
}

export function verifyToken(
  token: string,
  orderId: string,
  productHandle: string,
  email: string,
): boolean {
  try {
    const expected = generateToken(orderId, productHandle, email);
    return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run tests — verify they pass**

```
npx vitest run tests/lib/review-token.test.ts
```

Expected: 7/7 PASS.

- [ ] **Step 5: Commit**

```
git add lib/review-token.ts tests/lib/review-token.test.ts
git commit -m "feat: add HMAC review token utility"
```

---

## Task 4: Public Review Submission API

**Files:**
- Create: `app/api/reviews/route.ts`

- [ ] **Step 1: Create `app/api/reviews/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/review-token';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const { product_handle, author_name, rating, body: reviewBody, token, order_id, email } = body;

  if (!product_handle?.trim() || !author_name?.trim() || !reviewBody?.trim()) {
    return NextResponse.json(
      { error: 'product_handle, author_name, and body are required' },
      { status: 400 },
    );
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: 'rating must be an integer between 1 and 5' },
      { status: 400 },
    );
  }

  let verified_purchase = false;
  let approved = false;
  let token_used: string | null = null;

  if (token) {
    if (!order_id || !email) {
      return NextResponse.json(
        { error: 'order_id and email are required when submitting with a token' },
        { status: 400 },
      );
    }
    if (!verifyToken(token, order_id, product_handle, email)) {
      return NextResponse.json({ error: 'Invalid review token' }, { status: 400 });
    }
    const { data: existing } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('token_used', token)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'Token has already been used' }, { status: 400 });
    }
    verified_purchase = true;
    approved = true;
    token_used = token;
  }

  const { error } = await supabaseAdmin.from('reviews').insert({
    product_handle: product_handle.trim(),
    author_name: author_name.trim(),
    rating,
    body: reviewBody.trim(),
    verified_purchase,
    approved,
    token_used,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
```

- [ ] **Step 2: Run the dev server and test with curl**

Start the dev server: `npm run dev`

Test valid public submission:
```
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"product_handle":"cutting-board","author_name":"Jane","rating":5,"body":"Great product!"}'
```
Expected: `{"success":true}` with HTTP 201.

Test missing field:
```
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"product_handle":"cutting-board","author_name":"Jane","body":"Great!"}'
```
Expected: `{"error":"rating must be an integer between 1 and 5"}` with HTTP 400.

- [ ] **Step 3: Commit**

```
git add app/api/reviews/route.ts
git commit -m "feat: add public review submission API route"
```

---

## Task 5: Admin API Routes

**Files:**
- Create: `app/api/admin/reviews/route.ts`
- Create: `app/api/admin/reviews/[id]/route.ts`

- [ ] **Step 1: Create `app/api/admin/reviews/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAdminRequest } from '@/lib/admin-sig';

export async function GET(request: NextRequest) {
  if (!validateAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
```

- [ ] **Step 2: Create `app/api/admin/reviews/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAdminRequest } from '@/lib/admin-sig';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!validateAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const { action } = body;
  const { id } = params;

  if (action === 'approve') {
    const { error } = await supabaseAdmin
      .from('reviews')
      .update({ approved: true })
      .eq('id', id);
    if (error) return NextResponse.json({ error: 'Failed to approve' }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'reject') {
    const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
    if (error) return NextResponse.json({ error: 'Failed to reject' }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'action must be "approve" or "reject"' }, { status: 400 });
}
```

- [ ] **Step 3: Test with curl (dev server must be running)**

Test unauthorized access:
```
curl http://localhost:3000/api/admin/reviews
```
Expected: `{"error":"Unauthorized"}` with HTTP 401.

Test authorized access (replace `YOUR_ADMIN_SECRET` with your actual `ADMIN_SECRET` value from `.env.local`):
```
curl http://localhost:3000/api/admin/reviews \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```
Expected: JSON array (empty `[]` if no pending reviews, or review objects if any exist from Task 4 testing).

- [ ] **Step 4: Commit**

```
git add app/api/admin/reviews/route.ts "app/api/admin/reviews/[id]/route.ts"
git commit -m "feat: add admin API routes for review moderation"
```

---

## Task 6: Public Reviews Page + Submit Form

**Files:**
- Create: `app/reviews/ReviewSubmitForm.tsx`
- Create: `app/reviews/page.tsx`

- [ ] **Step 1: Create `app/reviews/ReviewSubmitForm.tsx`**

```tsx
'use client';
import { useState } from 'react';

const PRODUCTS = [
  { handle: 'cutting-board', label: 'Cutting Board' },
  { handle: 'business-card', label: 'Business Card' },
  { handle: 'granite-engraving', label: 'Granite Engraving' },
  { handle: 'custom-order', label: 'Custom Order' },
];

export default function ReviewSubmitForm() {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_handle: product, author_name: name, rating, body }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Submission failed');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="font-body text-white/60">
        Thank you! Your review has been submitted and will appear after moderation.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="tac-label block mb-2" style={{ fontSize: 9 }}>RATING</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                fontSize: 24,
                color: star <= (hover || rating) ? '#C9A227' : '#444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`${star} star`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="tac-label block mb-2" style={{ fontSize: 9 }}>YOUR NAME</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-body text-sm text-white/80 w-full"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,162,39,0.2)',
            borderRadius: 4,
            padding: '8px 12px',
          }}
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="tac-label block mb-2" style={{ fontSize: 9 }}>PRODUCT</label>
        <select
          required
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="font-body text-sm text-white/80 w-full"
          style={{
            background: 'rgba(40,40,40,1)',
            border: '1px solid rgba(201,162,39,0.2)',
            borderRadius: 4,
            padding: '8px 12px',
          }}
        >
          <option value="">Select a product…</option>
          {PRODUCTS.map((p) => (
            <option key={p.handle} value={p.handle}>{p.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="tac-label block mb-2" style={{ fontSize: 9 }}>REVIEW</label>
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="font-body text-sm text-white/80 w-full"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,162,39,0.2)',
            borderRadius: 4,
            padding: '8px 12px',
            resize: 'vertical',
          }}
          placeholder="Tell us about your experience…"
        />
      </div>

      {status === 'error' && (
        <p className="font-body text-sm" style={{ color: '#f87171' }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-gold w-fit"
        style={{ padding: '9px 20px', fontSize: 11 }}
      >
        {status === 'submitting' ? 'SUBMITTING…' : 'SUBMIT REVIEW'}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create `app/reviews/page.tsx`**

```tsx
import { supabase } from '@/lib/supabase';
import type { Review } from '@/lib/types';
import ReviewSubmitForm from './ReviewSubmitForm';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  return (
    <div style={{ background: '#07070A', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-heading text-4xl font-black text-brand-text mb-4">
          Customer Reviews
        </h1>
        <p className="font-body text-white/50 mb-12">Honest reviews from our customers.</p>

        {(reviews ?? []).length === 0 ? (
          <p className="font-body text-white/40 mb-16">No reviews yet. Be the first!</p>
        ) : (
          <div className="flex flex-col gap-5 mb-16">
            {(reviews as Review[]).map((review) => (
              <div
                key={review.id}
                style={{
                  border: '1px solid rgba(201,162,39,0.15)',
                  borderRadius: 6,
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ color: '#C9A227', fontSize: 16, letterSpacing: 2 }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                  {review.verified_purchase && (
                    <span className="tac-label" style={{ fontSize: 9, color: '#C9A227' }}>
                      VERIFIED PURCHASE
                    </span>
                  )}
                </div>
                <p className="font-body text-white/80 mb-3">{review.body}</p>
                <p className="font-body text-white/40 text-sm">
                  — {review.author_name} ·{' '}
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            border: '1px solid rgba(201,162,39,0.15)',
            borderRadius: 6,
            padding: '24px',
          }}
        >
          <h2 className="font-heading text-2xl font-black text-brand-text mb-6">
            Leave a Review
          </h2>
          <ReviewSubmitForm />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Visit `http://localhost:3000/reviews` and verify**

- [ ] Reviews list renders (or "No reviews yet" if empty)
- [ ] Submit form renders with star rating, name, product selector, textarea
- [ ] Submit a test review — confirm it shows "Thank you!" message
- [ ] Confirm the submitted review does NOT appear in the list yet (requires admin approval)

- [ ] **Step 4: Commit**

```
git add app/reviews/page.tsx app/reviews/ReviewSubmitForm.tsx
git commit -m "feat: add public reviews page with submission form"
```

---

## Task 7: Verified Purchase Review Flow

**Files:**
- Create: `app/reviews/[token]/ReviewForm.tsx`
- Create: `app/reviews/[token]/page.tsx`

- [ ] **Step 1: Create `app/reviews/[token]/ReviewForm.tsx`**

```tsx
'use client';
import { useState } from 'react';

type Props = {
  token: string;
  orderId: string;
  productHandle: string;
  authorName: string;
  email: string;
};

export default function ReviewForm({ token, orderId, productHandle, authorName, email }: Props) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState(authorName);
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_handle: productHandle,
          author_name: name,
          rating,
          body,
          token,
          order_id: orderId,
          email,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Submission failed');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <p className="font-body text-white/60 text-lg mb-6">
          Thank you! Your verified review has been published.
        </p>
        <a href="/reviews" className="btn-gold" style={{ padding: '9px 20px', fontSize: 11 }}>
          VIEW ALL REVIEWS
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="tac-label block mb-2" style={{ fontSize: 9 }}>RATING</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                fontSize: 24,
                color: star <= (hover || rating) ? '#C9A227' : '#444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`${star} star`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="tac-label block mb-2" style={{ fontSize: 9 }}>YOUR NAME</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-body text-sm text-white/80 w-full"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,162,39,0.2)',
            borderRadius: 4,
            padding: '8px 12px',
          }}
        />
      </div>

      <div>
        <label className="tac-label block mb-2" style={{ fontSize: 9 }}>REVIEW</label>
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="font-body text-sm text-white/80 w-full"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,162,39,0.2)',
            borderRadius: 4,
            padding: '8px 12px',
            resize: 'vertical',
          }}
          placeholder="Tell us about your experience…"
        />
      </div>

      {status === 'error' && (
        <p className="font-body text-sm" style={{ color: '#f87171' }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-gold w-fit"
        style={{ padding: '9px 20px', fontSize: 11 }}
      >
        {status === 'submitting' ? 'SUBMITTING…' : 'SUBMIT REVIEW'}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create `app/reviews/[token]/page.tsx`**

```tsx
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/review-token';
import ReviewForm from './ReviewForm';

function ErrorPage({ message }: { message: string }) {
  return (
    <div style={{ background: '#07070A', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="font-body text-white/50 text-lg mb-6">{message}</p>
        <a href="/reviews" className="btn-gold" style={{ padding: '9px 20px', fontSize: 11 }}>
          VIEW ALL REVIEWS
        </a>
      </div>
    </div>
  );
}

export default async function VerifiedReviewPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { order?: string; product?: string; name?: string; email?: string };
}) {
  const { token } = params;
  const { order, product, name, email } = searchParams;

  if (!order || !product || !email) {
    return <ErrorPage message="This review link is invalid or incomplete." />;
  }

  if (!verifyToken(token, order, product, email)) {
    return <ErrorPage message="This review link is invalid or has expired." />;
  }

  const { data: existing } = await supabaseAdmin
    .from('reviews')
    .select('id')
    .eq('token_used', token)
    .maybeSingle();

  if (existing) {
    return <ErrorPage message="You've already submitted a review with this link." />;
  }

  return (
    <div style={{ background: '#07070A', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-heading text-4xl font-black text-brand-text mb-3">
          Leave a Review
        </h1>
        <p className="font-body text-white/50 mb-10">
          Your purchase has been verified. Your review will be published immediately.
        </p>
        <ReviewForm
          token={token}
          orderId={order}
          productHandle={product}
          authorName={name ?? ''}
          email={email}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Generate a test token and verify the page**

In Node.js (run `node` in the project directory):

```javascript
const crypto = require('crypto');
// Replace with your actual REVIEW_HMAC_SECRET from .env.local
const secret = 'your-hmac-secret-here';
const token = crypto.createHmac('sha256', secret)
  .update('order1:cutting-board:test@example.com')
  .digest('hex');
console.log(token);
```

Visit: `http://localhost:3000/reviews/{token}?order=order1&product=cutting-board&name=Test+User&email=test@example.com`

- [ ] Form renders with "Leave a Review" heading and "Your purchase has been verified" message
- [ ] Submit the form — confirm success message and review appears on `/reviews` immediately (no moderation needed)
- [ ] Visit the same URL again — confirm "already submitted" message

Test invalid token: visit `/reviews/invalidtoken?order=order1&product=cutting-board&email=test@example.com`
- [ ] Confirm "invalid or has expired" error message

- [ ] **Step 4: Commit**

```
git add "app/reviews/[token]/page.tsx" "app/reviews/[token]/ReviewForm.tsx"
git commit -m "feat: add verified purchase review flow with HMAC token validation"
```

---

## Task 8: Admin Moderation Page

**Files:**
- Create: `app/admin/reviews/page.tsx`

- [ ] **Step 1: Create `app/admin/reviews/page.tsx`**

```tsx
'use client';
import { useState } from 'react';
import type { Review } from '@/lib/types';

export default function AdminReviewsPage() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchReviews(adminSecret: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/reviews', {
        headers: { Authorization: `Bearer ${adminSecret}` },
      });
      if (res.status === 401) {
        setError('Incorrect secret.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setReviews(data);
      setAuthed(true);
    } catch {
      setError('Failed to fetch reviews.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: 'approve' | 'reject') {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  }

  return (
    <div style={{ background: '#07070A', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-heading text-3xl font-black text-brand-text mb-8">
          Review Moderation
        </h1>

        {!authed ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchReviews(secret);
            }}
            className="flex flex-col gap-4 max-w-sm"
          >
            <label className="tac-label" style={{ fontSize: 9 }}>ADMIN SECRET</label>
            <input
              type="password"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="font-body text-sm text-white/80"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,162,39,0.2)',
                borderRadius: 4,
                padding: '8px 12px',
              }}
              placeholder="Enter admin secret"
            />
            {error && <p className="font-body text-sm" style={{ color: '#f87171' }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-fit"
              style={{ padding: '9px 20px', fontSize: 11 }}
            >
              {loading ? 'LOADING…' : 'LOAD REVIEWS'}
            </button>
          </form>
        ) : reviews.length === 0 ? (
          <p className="font-body text-white/40">No reviews pending moderation.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  border: '1px solid rgba(201,162,39,0.15)',
                  borderRadius: 6,
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span style={{ color: '#C9A227', fontSize: 14 }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                  <span className="font-body text-white/40 text-xs">{review.product_handle}</span>
                </div>
                <p className="font-body text-white/80 mb-1">{review.body}</p>
                <p className="font-body text-white/40 text-sm mb-4">— {review.author_name}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(review.id, 'approve')}
                    className="btn-gold"
                    style={{ padding: '6px 14px', fontSize: 10 }}
                  >
                    APPROVE
                  </button>
                  <button
                    onClick={() => handleAction(review.id, 'reject')}
                    style={{
                      padding: '6px 14px',
                      fontSize: 10,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      color: 'rgba(255,255,255,0.4)',
                      fontFamily: 'inherit',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                    }}
                  >
                    REJECT
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify at `http://localhost:3000/admin/reviews`**

- [ ] Secret input renders
- [ ] Wrong secret shows "Incorrect secret." error
- [ ] Correct secret loads the pending reviews queue
- [ ] Approve a review — confirm it disappears from the queue and appears on `/reviews`
- [ ] Reject a review — confirm it disappears from the queue and does not appear on `/reviews`

- [ ] **Step 3: Commit**

```
git add app/admin/reviews/page.tsx
git commit -m "feat: add admin review moderation page"
```

---

## Task 9: ReviewsSection + Homepage Integration

**Files:**
- Create: `components/home/ReviewsSection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/home/ReviewsSection.tsx`**

```tsx
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Review } from '@/lib/types';

export default async function ReviewsSection() {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, author_name, rating, body, verified_purchase')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(3);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section style={{ background: '#07070A', borderTop: '1px solid rgba(201,162,39,0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="tac-label mb-3" style={{ fontSize: 9 }}>CUSTOMER REVIEWS</p>
          <h2 className="font-heading text-3xl font-black text-brand-text">
            What Our Customers Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {(reviews as Pick<Review, 'id' | 'author_name' | 'rating' | 'body' | 'verified_purchase'>[]).map(
            (review) => (
              <div
                key={review.id}
                style={{
                  border: '1px solid rgba(201,162,39,0.15)',
                  borderRadius: 6,
                  padding: '20px 24px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="mb-3" style={{ color: '#C9A227', fontSize: 16, letterSpacing: 2 }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p className="font-body text-white/70 text-sm leading-relaxed mb-4">
                  &ldquo;{review.body}&rdquo;
                </p>
                <p className="font-body text-white/40 text-xs">— {review.author_name}</p>
              </div>
            ),
          )}
        </div>
        <div className="text-center">
          <Link
            href="/reviews"
            className="font-body text-sm text-white/40 hover:text-gold-light transition-colors no-underline"
          >
            Read all reviews →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update `app/page.tsx`**

Add the import and component to the homepage. The current file is:

```tsx
export const dynamic = 'force-dynamic';

import Hero from '@/components/home/Hero';
import StatsBar from '@/components/home/StatsBar';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CustomOrderBand from '@/components/home/CustomOrderBand';
import ProcessSteps from '@/components/home/ProcessSteps';
import GalleryTeaser from '@/components/home/GalleryTeaser';
import VeteranStory from '@/components/home/VeteranStory';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedProducts />
      <CustomOrderBand />
      <ProcessSteps />
      <GalleryTeaser />
      <VeteranStory />
    </>
  );
}
```

Replace with:

```tsx
export const dynamic = 'force-dynamic';

import Hero from '@/components/home/Hero';
import StatsBar from '@/components/home/StatsBar';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CustomOrderBand from '@/components/home/CustomOrderBand';
import ProcessSteps from '@/components/home/ProcessSteps';
import GalleryTeaser from '@/components/home/GalleryTeaser';
import VeteranStory from '@/components/home/VeteranStory';
import ReviewsSection from '@/components/home/ReviewsSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedProducts />
      <CustomOrderBand />
      <ProcessSteps />
      <GalleryTeaser />
      <VeteranStory />
      <ReviewsSection />
    </>
  );
}
```

- [ ] **Step 3: Verify homepage at `http://localhost:3000`**

- [ ] If there are approved reviews in Supabase: "What Our Customers Say" section renders with up to 3 reviews
- [ ] If no approved reviews exist: section is hidden (returns null)
- [ ] "Read all reviews →" link navigates to `/reviews`

- [ ] **Step 4: Run all tests**

```
npx vitest run
```

Expected: All tests pass (11 youtube tests + 4 admin-sig tests + 7 review-token tests = 22 total).

- [ ] **Step 5: Commit**

```
git add components/home/ReviewsSection.tsx app/page.tsx
git commit -m "feat: add ReviewsSection to homepage"
```

- [ ] **Step 6: Push to GitHub**

```
git push github master
```
