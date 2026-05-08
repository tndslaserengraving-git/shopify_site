# Bug Report: Next.js E1068 — `InvariantError: Expected workStore to be initialized` During Production Build

## Summary

Production builds (`next build`) fail with an unhandled `InvariantError` during static prerendering of the built-in `/_global-error` page. The error is thrown unconditionally inside `createServerPathnameForMetadata` when no request context (`workStore`) exists — a condition that is expected and legitimate during static generation.

---

## Environment

| Field | Value |
|-------|-------|
| **Next.js** | 16.2.4 (Turbopack) |
| **React** | 19.2.4 |
| **Node.js** | (Windows 10 Pro 10.0.19045) |
| **Bundler** | Turbopack (default for Next.js 16) |
| **Package manager** | npm |

---

## Error

```
Error occurred prerendering page "/_global-error".
Error [InvariantError]: Invariant: Expected workStore to be initialized. This is a bug in Next.js.
    at N (.next/server/chunks/ssr/[root-of-the-server]__0vddmfe._.js:8:86619)
    at M (.next/server/chunks/ssr/[root-of-the-server]__0vddmfe._.js:8:86520)
    at <unknown> (.next/server/chunks/ssr/[root-of-the-server]__0vddmfe._.js:13:29090)
Export encountered an error on /_global-error/page: /_global-error, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null
```

---

## Steps to Reproduce

1. Create a new Next.js 16.2.4 App Router project (any content, including an empty one)
2. Run `npm run build`
3. Observe build failure during the "Generating static pages" phase

No custom `global-error.tsx` is required. The error occurs against Next.js's own built-in `/_global-error` page handler.

---

## Root Cause Analysis

### Call chain

During static prerendering of `/_global-error`, Next.js invokes metadata resolution, which calls:

```
createMetadataComponents()
  → resolveMetadata()
    → createServerPathnameForMetadata(underlyingPathname)   ← throws here
```

### The offending code

**File:** `node_modules/next/dist/esm/server/request/pathname.js` (ESM)  
**File:** `node_modules/next/dist/server/request/pathname.js` (CJS)

```js
export function createServerPathnameForMetadata(underlyingPathname) {
    const workStore = workAsyncStorage.getStore();
    if (!workStore) {
        // ❌ Unconditional throw — no fallback for static prerendering
        throw Object.defineProperty(
            new InvariantError('Expected workStore to be initialized'),
            "__NEXT_ERROR_CODE",
            { value: "E1068", enumerable: false, configurable: true }
        );
    }
    // ... normal path
}
```

`workAsyncStorage.getStore()` returns `null` during static prerendering because there is no active HTTP request context. Every other prerender path in this file (e.g. `createRenderPathname`) correctly handles this by returning `Promise.resolve(underlyingPathname)`, but the `!workStore` guard has no such fallback.

### Why the error always targets `/_global-error`

Next.js 16 unconditionally prerenderes `/_global-error` as a static page, even when no custom `global-error.tsx` exists. This page runs through metadata resolution without a request context, hitting the missing fallback on every build.

---

## What Does NOT Fix It

The following were attempted without success:

| Approach | Result |
|----------|--------|
| Adding custom `global-error.tsx` with `export const dynamic = 'force-dynamic'` | `force-dynamic` is **ignored** for client components; Next.js 16 enforces that `global-error.tsx` must be a Client Component at compile time, making this a no-op |
| Server component wrapper for `global-error.tsx` | Blocked — the compiler rejects a server component at the global error boundary |
| Adding `export const dynamic = 'force-dynamic'` to all other pages | `/_global-error` prerendering continues regardless of other pages' config |
| Patching `node_modules/next/dist/esm/server/request/pathname.js` directly | **Ineffective** — Turbopack bundles Next.js internals from a pre-compiled cached chunk (`[root-of-the-server]__0vddmfe._.js`) whose hash never changes regardless of modifications to the source `.js` files. The cache cannot be invalidated by editing node_modules. |
| Upgrading to Next.js 16.2.5 / 16.2.6 | Both crash on Windows with `0xC0000005 (STATUS_ACCESS_VIOLATION)` during TypeScript checking, rendering the project unbuildable |

---

## Proposed Fix

Inside `createServerPathnameForMetadata`, replace the unconditional throw with the same graceful fallback already used throughout the rest of the file:

```diff
 export function createServerPathnameForMetadata(underlyingPathname) {
     const workStore = workAsyncStorage.getStore();
     if (!workStore) {
-        throw Object.defineProperty(
-            new InvariantError('Expected workStore to be initialized'),
-            "__NEXT_ERROR_CODE",
-            { value: "E1068", enumerable: false, configurable: true }
-        );
+        // No request context during static prerendering — return pathname as a
+        // resolved promise, consistent with createRenderPathname's behaviour.
+        return Promise.resolve(underlyingPathname);
     }
     // ...
 }
```

The same change should be applied to both:
- `node_modules/next/dist/esm/server/request/pathname.js`
- `node_modules/next/dist/server/request/pathname.js`

> **Note for Next.js maintainers:** Because Turbopack pre-compiles Next.js internals into a persistent content-addressed chunk (`[root-of-the-server]__<hash>._.js`), patching source files in `dist/` alone is insufficient. The fix must be applied upstream and re-bundled into the compiled Turbopack runtimes shipped in the package.

---

## Impact

- **Any** Next.js 16.2.4 project using App Router and Turbopack **cannot produce a production build** on any platform.
- The error is non-deterministic in appearance (it surfaces as a `/_global-error` prerender failure) but is 100% reproducible.
- No user-space workaround exists: the built-in `/_global-error` boundary cannot be opted out of static generation.

---

## Additional Context

- `node_modules/next/dist/esm/server/request/params.js` and `search-params.js` contain the same pattern and may be affected by the same issue in other code paths.
- The error message text (`"This is a bug in Next.js"`) is appended by the `InvariantError` class constructor and appears in the stack trace, which is accurate — this is indeed a framework bug, not a user error.
- Next.js 14.x (tested: 14.2.5) does not exhibit this bug; it predates the `createServerPathnameForMetadata` API.

---

*Reported from project: TNDS_Site (Next.js App Router, Tailwind CSS 4, Shopify Storefront API)*
