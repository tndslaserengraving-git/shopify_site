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
                <p className="font-body text-white/40 text-xs">&mdash; {review.author_name}</p>
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
