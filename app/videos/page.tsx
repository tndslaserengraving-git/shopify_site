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
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-presentation"
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
