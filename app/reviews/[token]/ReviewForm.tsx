'use client';
import { useState } from 'react';

type Props = {
  token: string;
  orderId: string;
  productHandle: string;
  authorName: string;
  email: string;
};

export default function ReviewForm({ token, orderId, productHandle, authorName, email }: Props) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState(authorName);
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_handle: productHandle,
          author_name: name,
          rating,
          body,
          token,
          order_id: orderId,
          email,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Submission failed');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <p className="font-body text-white/60 text-lg mb-6">
          Thank you! Your verified review has been published.
        </p>
        <a href="/reviews" className="btn-gold" style={{ padding: '9px 20px', fontSize: 11 }}>
          VIEW ALL REVIEWS
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="tac-label block mb-2" style={{ fontSize: 9 }}>RATING</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                fontSize: 24,
                color: star <= (hover || rating) ? '#C9A227' : '#444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`${star} star`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="tac-label block mb-2" style={{ fontSize: 9 }}>YOUR NAME</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-body text-sm text-white/80 w-full"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,162,39,0.2)',
            borderRadius: 4,
            padding: '8px 12px',
          }}
        />
      </div>

      <div>
        <label className="tac-label block mb-2" style={{ fontSize: 9 }}>REVIEW</label>
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="font-body text-sm text-white/80 w-full"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,162,39,0.2)',
            borderRadius: 4,
            padding: '8px 12px',
            resize: 'vertical',
          }}
          placeholder="Tell us about your experience…"
        />
      </div>

      {status === 'error' && (
        <p className="font-body text-sm" style={{ color: '#f87171' }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-gold w-fit"
        style={{ padding: '9px 20px', fontSize: 11 }}
      >
        {status === 'submitting' ? 'SUBMITTING…' : 'SUBMIT REVIEW'}
      </button>
    </form>
  );
}
