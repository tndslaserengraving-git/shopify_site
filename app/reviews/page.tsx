import { supabase } from '@/lib/supabase';
import type { Review } from '@/lib/types';
import ReviewSubmitForm from './ReviewSubmitForm';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });
  if (error) console.error('Failed to fetch reviews:', error);

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
                {review.photo_url && (
                  <img
                    src={review.photo_url}
                    alt={`Photo from ${review.author_name}`}
                    style={{
                      maxWidth: 240,
                      maxHeight: 240,
                      borderRadius: 4,
                      objectFit: 'cover',
                      marginBottom: 12,
                      display: 'block',
                    }}
                  />
                )}
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
