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
                <p className="font-body text-white/40 text-sm mb-4">&mdash; {review.author_name}</p>
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
