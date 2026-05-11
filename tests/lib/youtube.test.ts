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
