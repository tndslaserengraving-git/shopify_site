# Review System — Design Spec
**Date:** 2026-05-10
**Status:** Approved

## Goal

Add a two-tier customer review system to the TNDS site: verified purchase reviews (HMAC-signed link from order email, auto-approved) and public reviews (moderated by admin). Reviews display on a public reviews page and in a homepage section.

## Prerequisites

- Supabase project already exists with schema applied (user confirmed)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` env vars already in Vercel and `.env.local`
- `ADMIN_SECRET` env var for protecting admin API routes
- `REVIEW_HMAC_SECRET` env var for signing/verifying purchase tokens
- `@supabase/supabase-js` must be reinstalled (`npm install @supabase/supabase-js`)

## Data Model

Table: `reviews`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid, PK | auto-generated |
| `product_handle` | text | Shopify product handle |
| `author_name` | text | display name |
| `rating` | int (1–5) | required |
| `body` | text | review text |
| `verified_purchase` | boolean | true = came through HMAC token flow |
| `approved` | boolean | false = pending moderation |
| `token_used` | text, nullable | HMAC token string (prevents reuse) |
| `created_at` | timestamptz | auto |

## HMAC Token Flow

1. When a customer completes an order, a signed review link is included in their confirmation email (or generated manually by the store owner)
2. Token = `HMAC-SHA256(orderId + ":" + productHandle + ":" + customerEmail, REVIEW_HMAC_SECRET)` — hex-encoded
3. URL format: `/reviews/{token}?order={orderId}&product={productHandle}&name={customerName}`
4. On the review page: token is validated server-side before rendering the form
5. On submit: token is validated again, review saved with `verified_purchase=true`, `approved=true`, token stored in `token_used` to prevent reuse

## Architecture

### New files
| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/supabase.ts` | Browser/server Supabase client (anon key) |
| Create | `lib/supabase-admin.ts` | Server-only Supabase client (service role key) |
| Create | `lib/admin-sig.ts` | Validate `ADMIN_SECRET` on admin API routes |
| Create | `lib/review-token.ts` | Generate and verify HMAC review tokens |
| Create | `app/api/reviews/route.ts` | POST: submit public review (unverified, pending moderation) |
| Create | `app/api/admin/reviews/route.ts` | GET: list pending reviews (admin only) |
| Create | `app/api/admin/reviews/[id]/route.ts` | POST approve/reject a review (admin only) |
| Create | `app/reviews/page.tsx` | Public reviews listing (all approved reviews) |
| Create | `app/reviews/[token]/page.tsx` | Verified purchase review form |
| Create | `app/reviews/[token]/ReviewForm.tsx` | Client component: review form with star rating |
| Create | `app/admin/reviews/page.tsx` | Admin moderation UI (approve/reject queue) |
| Create | `components/home/ReviewsSection.tsx` | Homepage reviews display (latest approved, server component) |

### Updated files
| Action | Path | Change |
|--------|------|--------|
| Modify | `app/page.tsx` | Add `<ReviewsSection />` to homepage |

## API Routes

### `POST /api/reviews`
Public submission — no auth required.

Request body: `{ product_handle, author_name, rating, body }`

Validation:
- `rating` must be 1–5
- `author_name` and `body` required, non-empty
- `product_handle` required

Response: `201` on success, `400` on validation failure.

Saves with `approved: false`, `verified_purchase: false`.

### `GET /api/admin/reviews`
Returns all reviews where `approved = false`.
Protected: requires `Authorization: Bearer {ADMIN_SECRET}` header.
Response: `200` with array of review objects.

### `POST /api/admin/reviews/[id]`
Body: `{ action: "approve" | "reject" }`
- `approve`: sets `approved = true`
- `reject`: deletes the row

Protected: requires `Authorization: Bearer {ADMIN_SECRET}` header.
Response: `200` on success, `404` if review not found.

## Pages

### `/reviews`
Server component. Fetches all reviews where `approved = true`, ordered by `created_at DESC`. Displays star rating, author name, date, and review body. Includes a "Leave a Review" form inline (client component calls `POST /api/reviews`).

### `/reviews/[token]`
Server component. Validates token on the server before rendering.
- Invalid token → renders error message (not a redirect, to avoid token fishing)
- Already used token → renders "already submitted" message
- Valid token → renders `ReviewForm` client component with pre-filled name from query param

On submit (`ReviewForm`): calls server action or `POST /api/reviews` with verified purchase data + token. Server validates token again, saves with `verified_purchase: true`, `approved: true`.

### `/admin/reviews`
Client component (needs interactivity). Fetches pending reviews from `GET /api/admin/reviews` on load. Admin enters `ADMIN_SECRET` in a password field to authenticate. Each review card has Approve and Reject buttons that call `POST /api/admin/reviews/[id]`.

**No persistent admin session** — secret entered once per page load. Simple and avoids auth infrastructure.

### `ReviewsSection` (homepage)
Server component. Fetches 3 most recent approved reviews. Renders star rating + quote + author name. Displays a "Read all reviews →" link to `/reviews`.

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Supabase unreachable on public pages | Show empty state, no crash |
| Invalid review submission | Return 400 with field-level error messages |
| Invalid HMAC token | Render error message on the page |
| Already-used token | Render "already submitted" message |
| Admin wrong secret | API returns 401; page shows "Incorrect secret" |

## Out of Scope
- Review images/photos
- Review responses from the owner
- Pagination on the reviews page (show all approved reviews; add pagination later if needed)
- Email notifications to admin when a new review is submitted
- Automated email sending of review links (link generation is manual for now)
