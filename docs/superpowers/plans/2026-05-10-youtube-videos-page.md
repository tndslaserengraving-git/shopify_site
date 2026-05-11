# YouTube Videos Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated `/videos` page that auto-fetches the latest 12 videos from the TNDS YouTube channel, embeds the newest video, and grids the rest — with nav links added to the Header and Footer.

**Architecture:** `lib/youtube.ts` handles all YouTube Data API v3 calls (channels → playlistItems → videos) and returns typed `YouTubeVideo` objects. `app/videos/page.tsx` is a Next.js App Router server component with ISR revalidation every hour. Navigation components are updated to include the new route.

**Tech Stack:** Next.js 14 App Router (server components, ISR), YouTube Data API v3, TypeScript, Vitest

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/youtube.ts` | API calls, types, duration/viewcount formatters |
| Create | `__tests__/lib/youtube.test.ts` | Unit tests for the utility |
| Create | `app/videos/page.tsx` | Videos page: hero, featured embed, grid, fallback |
| Modify | `components/layout/Header.tsx` | Add "Videos" to desktop + mobile nav |
| Modify | `components/layout/Footer.tsx` | Add "Videos" to Quick Links |

---

## Task 1: YouTube API Utility (TDD)

**Files:**
- Create: `lib/youtube.ts`
- Create: `__tests__/lib/youtube.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/lib/youtube.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLatestVideos, formatDuration, formatViewCount } from '@/lib/youtube';

const mockChannelResponse = {
  items: [{ contentDetails: { relatedPlaylists: { uploads: 'UUtest123' } } }],
};
const mockPlaylistResponse = {
  items: [
    { contentDetails: { videoId: 'vid1' } },
    { contentDetails: { videoId: 'vid2' } },
  ],
};
const mockVideosResponse = {
  items: [
    {
      id: 'vid1',
      snippet: {
        title: 'Test Video 1',
        thumbnails: { maxres: { url: 'https://img.youtube.com/vi/vid1/maxresdefault.jpg' } },
        publishedAt: '2026-01-01T00:00:00Z',
      },
      contentDetails: { duration: 'PT4M13S' },
      statistics: { viewCount: '1234' },
    },
    {
      id: 'vid2',
      snippet: {
        title: 'Test Video 2',
        thumbnails: { high: { url: 'https://img.youtube.com/vi/vid2/hqdefault.jpg' } },
        publishedAt: '2026-01-02T00:00:00Z',
      },
      contentDetails: { duration: 'PT1H2M30S' },
      statistics: { viewCount: '1500000' },
    },
  ],
};

function makeFetch(...responses: object[]) {
  let callCount = 0;
  return vi.fn(() => {
    const response = responses[callCount++];
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
    });
  });
}

describe('formatDuration', () => {
  it('formats minutes and seconds', () => {
    expect(formatDuration('PT4M13S')).toBe('4:13');
  });
  it('formats hours, minutes, and seconds', () => {
    expect(formatDuration('PT1H2M30S')).toBe('1:02:30');
  });
  it('formats seconds only', () => {
    expect(formatDuration('PT45S')).toBe('0:45');
  });
  it('returns empty string for unrecognised input', () => {
    expect(formatDuration('invalid')).toBe('');
  });
});

describe('formatViewCount', () => {
  it('formats millions', () => {
    expect(formatViewCount('1500000')).toBe('1.5M');
  });
  it('formats thousands', () => {
    expect(formatViewCount('1234')).toBe('1.2K');
  });
  it('returns raw count under 1000', () => {
    expect(formatViewCount('999')).toBe('999');
  });
});

describe('fetchLatestVideos', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns formatted videos from API', async () => {
    vi.stubGlobal('fetch', makeFetch(mockChannelResponse, mockPlaylistResponse, mockVideosResponse));
    const videos = await fetchLatestVideos('UCtest', 'fake-key');

    expect(videos).toHaveLength(2);
    expect(videos[0]).toEqual({
      id: 'vid1',
      title: 'Test Video 1',
      thumbnailUrl: 'https://img.youtube.com/vi/vid1/maxresdefault.jpg',
      publishedAt: '2026-01-01T00:00:00Z',
      duration: '4:13',
      viewCount: '1.2K',
      url: 'https://www.youtube.com/watch?v=vid1',
    });
    expect(videos[1].duration).toBe('1:02:30');
    expect(videos[1].viewCount).toBe('1.5M');
  });

  it('returns empty array when channel items is empty', async () => {
    vi.stubGlobal('fetch', makeFetch({ items: [] }));
    const videos = await fetchLatestVideos('UCtest', 'fake-key');
    expect(videos).toEqual([]);
  });

  it('returns empty array when playlist is empty', async () => {
    vi.stubGlobal('fetch', makeFetch(mockChannelResponse, { items: [] }));
    const videos = await fetchLatestVideos('UCtest', 'fake-key');
    expect(videos).toEqual([]);
  });

  it('throws when channels API returns non-ok status', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, status: 403 })));
    await expect(fetchLatestVideos('UCtest', 'fake-key')).rejects.toThrow(
      'YouTube channels API error: 403',
    );
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```
npx vitest run __tests__/lib/youtube.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/youtube'`

If you get a path alias error instead, check that `vitest.config.ts` (or `vite.config.ts`) has `resolve.alias: { '@': path.resolve(__dirname, './') }`. Add it if missing.

- [ ] **Step 3: Create `lib/youtube.ts`**

```typescript
export type YouTubeVideo = {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  url: string;
};

export function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  const h = parseInt(match[1] ?? '0');
  const m = parseInt(match[2] ?? '0');
  const s = parseInt(match[3] ?? '0');
  const ss = s.toString().padStart(2, '0');
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

export function formatViewCount(count: string): string {
  const n = parseInt(count, 10);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return count;
}

type RawVideoItem = {
  id: string;
  snippet: {
    title: string;
    thumbnails: { maxres?: { url: string }; high: { url: string } };
    publishedAt: string;
  };
  contentDetails: { duration: string };
  statistics: { viewCount: string };
};

export async function fetchLatestVideos(
  channelId: string,
  apiKey: string,
  maxResults = 12,
): Promise<YouTubeVideo[]> {
  const base = 'https://www.googleapis.com/youtube/v3';

  const channelRes = await fetch(
    `${base}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
  );
  if (!channelRes.ok) throw new Error(`YouTube channels API error: ${channelRes.status}`);
  const channelData = await channelRes.json();
  const uploadsId: string | undefined =
    channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return [];

  const playlistRes = await fetch(
    `${base}/playlistItems?part=contentDetails&playlistId=${uploadsId}&maxResults=${maxResults}&key=${apiKey}`,
  );
  if (!playlistRes.ok) throw new Error(`YouTube playlistItems API error: ${playlistRes.status}`);
  const playlistData = await playlistRes.json();
  const videoIds: string[] = (playlistData.items ?? []).map(
    (item: { contentDetails: { videoId: string } }) => item.contentDetails.videoId,
  );
  if (videoIds.length === 0) return [];

  const videosRes = await fetch(
    `${base}/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${apiKey}`,
  );
  if (!videosRes.ok) throw new Error(`YouTube videos API error: ${videosRes.status}`);
  const videosData = await videosRes.json();

  return (videosData.items ?? []).map((item: RawVideoItem): YouTubeVideo => ({
    id: item.id,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.maxres?.url ?? item.snippet.thumbnails.high.url,
    publishedAt: item.snippet.publishedAt,
    duration: formatDuration(item.contentDetails.duration),
    viewCount: formatViewCount(item.statistics.viewCount),
    url: `https://www.youtube.com/watch?v=${item.id}`,
  }));
}
```

- [ ] **Step 4: Run tests — verify they pass**

```
npx vitest run __tests__/lib/youtube.test.ts
```

Expected: All 11 tests PASS.

- [ ] **Step 5: Commit**

```
git add lib/youtube.ts __tests__/lib/youtube.test.ts
git commit -m "feat: add YouTube API utility with types and formatters"
```

---

## Task 2: Videos Page

**Files:**
- Create: `app/videos/page.tsx`

- [ ] **Step 1: Create `app/videos/page.tsx`**

```tsx
import { fetchLatestVideos } from '@/lib/youtube';
import { PlayCircle } from 'lucide-react';

export const revalidate = 3600;

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? '';
const API_KEY = process.env.YOUTUBE_API_KEY ?? '';
const CHANNEL_URL = 'https://www.youtube.com/@TNDSLaserEngraving';

export default async function VideosPage() {
  let videos: Awaited<ReturnType<typeof fetchLatestVideos>> = [];
  let fetchFailed = false;

  try {
    if (CHANNEL_ID && API_KEY) {
      videos = await fetchLatestVideos(CHANNEL_ID, API_KEY);
    } else {
      fetchFailed = true;
    }
  } catch {
    fetchFailed = true;
  }

  const [featured, ...rest] = videos;

  return (
    <div style={{ background: '#07070A', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl font-black text-brand-text mb-4">
            Watch Us Work
          </h1>
          <p className="font-body text-white/60 text-lg mb-6">
            See our craft in action — follow us on YouTube for new videos every week
          </p>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2"
            style={{ padding: '10px 20px', fontSize: 12 }}
          >
            <PlayCircle size={14} aria-hidden="true" />
            SUBSCRIBE ON YOUTUBE
          </a>
        </div>

        {/* Fallback */}
        {(fetchFailed || videos.length === 0) && (
          <div className="text-center py-20">
            <p className="font-body text-white/40 mb-6">
              {fetchFailed
                ? 'Videos unavailable right now — visit us directly on YouTube.'
                : 'No videos yet — check back soon.'}
            </p>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ padding: '10px 20px', fontSize: 12 }}
            >
              Visit Our YouTube Channel
            </a>
          </div>
        )}

        {/* Featured video */}
        {featured && (
          <div className="mb-12">
            <div
              className="aspect-video w-full rounded overflow-hidden"
              style={{ border: '1px solid rgba(201,162,39,0.15)' }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${featured.id}`}
                title={featured.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="font-body text-white/60 text-sm mt-3">{featured.title}</p>
          </div>
        )}

        {/* Video grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {rest.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline group"
              >
                <div
                  className="rounded overflow-hidden transition-all duration-150"
                  style={{ border: '1px solid rgba(201,162,39,0.15)' }}
                >
                  <div className="relative aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute bottom-1.5 right-1.5 font-body text-xs text-white"
                      style={{
                        background: 'rgba(0,0,0,0.8)',
                        padding: '2px 5px',
                        borderRadius: 3,
                      }}
                    >
                      {video.duration}
                    </span>
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)' }}>
                    <p className="font-body text-sm text-white/80 line-clamp-2 mb-1 group-hover:text-gold-light transition-colors">
                      {video.title}
                    </p>
                    <p className="font-body text-xs text-white/40">
                      {video.viewCount} views ·{' '}
                      {new Date(video.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {videos.length > 0 && (
          <div className="text-center">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-white/50 hover:text-gold-light transition-colors no-underline"
            >
              See all videos on YouTube →
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build compiles**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```
git add app/videos/page.tsx
git commit -m "feat: add Videos page with YouTube embed and grid"
```

---

## Task 3: Navigation Updates

**Files:**
- Modify: `components/layout/Header.tsx` (add "Videos" to NAV array)
- Modify: `components/layout/Footer.tsx` (add "Videos" to Quick Links)

- [ ] **Step 1: Add "Videos" to Header nav**

In `components/layout/Header.tsx`, find the `NAV` array:

```typescript
const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
```

Replace with:

```typescript
const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/videos', label: 'Videos' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
```

- [ ] **Step 2: Add "Videos" to Footer Quick Links**

In `components/layout/Footer.tsx`, find the Quick Links array:

```typescript
{[
  ['/shop', 'Shop'],
  ['/custom-order', 'Custom Orders'],
  ['/gallery', 'Gallery'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
].map(([href, label]) => (
```

Replace with:

```typescript
{[
  ['/shop', 'Shop'],
  ['/custom-order', 'Custom Orders'],
  ['/gallery', 'Gallery'],
  ['/videos', 'Videos'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
].map(([href, label]) => (
```

- [ ] **Step 3: Commit**

```
git add components/layout/Header.tsx components/layout/Footer.tsx
git commit -m "feat: add Videos link to header and footer nav"
```

---

## Task 4: Environment Variables & Verification

- [ ] **Step 1: Find the TNDS channel ID**

The YouTube URL is `https://www.youtube.com/@TNDSLaserEngraving`.

To get the Channel ID (needed for the API — the `@handle` form is not accepted by the API):
1. Open the channel page in a browser
2. Right-click → View Page Source
3. Search for `"channelId"` — it looks like `UCxxxxxxxxxxxxxxxxxxxxxxxxx`

Or use this URL and look for `channelId` in the response:
```
https://www.youtube.com/@TNDSLaserEngraving/about
```

- [ ] **Step 2: Set up a Google Cloud API key**

1. Go to https://console.cloud.google.com
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Library**
4. Search for **YouTube Data API v3** and click **Enable**
5. Go to **APIs & Services → Credentials → Create Credentials → API Key**
6. Click **Edit** on the new key → under **API restrictions**, select **Restrict key** → choose **YouTube Data API v3**
7. Copy the key value

- [ ] **Step 3: Add env vars to `.env.local` for local development**

Create or edit `.env.local` in the project root:

```
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxxxxx
```

`.env.local` is already gitignored — do not commit it.

- [ ] **Step 4: Add env vars to Vercel**

1. Go to your Vercel project dashboard
2. **Settings → Environment Variables**
3. Add `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` for all environments (Production, Preview, Development)

- [ ] **Step 5: Start the dev server and verify**

```
npm run dev
```

Open `http://localhost:3000/videos` and check:
- [ ] Page title "Watch Us Work" renders
- [ ] "Subscribe on YouTube" button is visible
- [ ] Featured video iframe loads and plays
- [ ] Grid of video cards appears below
- [ ] Each card shows thumbnail, title, duration, view count, and date
- [ ] Clicking a card opens YouTube in a new tab
- [ ] "See all videos on YouTube →" link at the bottom works
- [ ] Header nav shows "Videos" link between Gallery and About
- [ ] Footer Quick Links includes "Videos"

- [ ] **Step 6: Test fallback (optional)**

Temporarily set `YOUTUBE_API_KEY=invalid` in `.env.local`, restart dev server, and visit `/videos`. Expected: fallback message with channel link displayed. Restore the real key when done.

- [ ] **Step 7: Push to GitHub**

```
git push github master
```

Vercel will auto-deploy. After deploy, verify `https://www.topnotchdesignstudio.com/videos` works with the live API key from Vercel env vars.
