# YouTube Videos Page — Design Spec
**Date:** 2026-05-10
**Status:** Approved

## Goal
Add a dedicated Videos page to the TNDS site that drives YouTube subscriptions and showcases the craft. Visitors can watch a featured video on-site and browse recent uploads, with a clear path to subscribe.

## Architecture & Data Flow

### New files
- `app/videos/page.tsx` — Next.js server component; fetches and renders the page
- `lib/youtube.ts` — YouTube Data API v3 utility (fetch function + TypeScript types)

### Updated files
- `components/layout/Header.tsx` — add "Videos" nav link
- `components/layout/Footer.tsx` — add "Videos" to Quick Links

### Data flow
1. `app/videos/page.tsx` calls `lib/youtube.ts` at render time (server-side)
2. `lib/youtube.ts` fetches the channel's latest 12 videos from YouTube Data API v3
3. Page is cached via Next.js ISR with `revalidate = 3600` (1 hour)
4. No client-side fetching — fully server-rendered for fast load and SEO

### Environment variables (Vercel)
- `YOUTUBE_API_KEY` — restricted Google Cloud API key (YouTube Data API v3 only)
- `YOUTUBE_CHANNEL_ID` — the channel ID for `@TNDSLaserEngraving`

### API quota
Fetching 12 videos costs ~3 units per page load. Well within the 10,000 units/day free tier.

## Page Layout

### Header area
- Page title: "Watch Us Work"
- Subtitle: "See our craft in action — follow us on YouTube for new videos every week"
- Subscribe CTA button styled in site gold, links to channel (`target="_blank"`)

### Featured video
- Most recent video rendered as a full-width `<iframe>` embed (YouTube nocookie domain)
- Visitors can watch without leaving the site

### Video grid
- Remaining 11 videos in a responsive grid: 3 columns desktop, 2 columns mobile
- Each card shows: thumbnail, title, duration, view count, publish date
- Clicking a card opens the video on YouTube in a new tab

### Footer CTA
- "See all videos on YouTube →" link styled as a secondary button, links to channel

## Error Handling

| Scenario | Behavior |
|---|---|
| API key missing / invalid | Static fallback: "Watch us on YouTube" banner + channel link |
| API quota exceeded | ISR serves last cached response; fallback if no cache exists |
| No videos returned | Empty state: "No videos yet — check back soon" + channel link |
| Network error during fetch | Serve last ISR cache if available, otherwise static fallback |

Users always see something useful — never a broken page.

## Out of Scope
- Automatic video embedding for all grid cards (only the featured video is embedded; rest link out)
- Comments, likes, or any YouTube interaction beyond viewing
- Channel analytics or admin features
