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
