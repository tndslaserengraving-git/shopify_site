'use client';
import { useState } from 'react';
import { addToCart } from '@/app/shop/[handle]/actions';
import type { ShopifyVariant } from '@/lib/shopify';

interface Props {
  variants: ShopifyVariant[];
}

export default function AddToCart({ variants }: Props) {
  const available = variants.filter((v) => v.availableForSale);
  const [selectedId, setSelectedId] = useState(available[0]?.id ?? variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showVariants = variants.length > 1 || (variants.length === 1 && variants[0].title !== 'Default Title');

  async function handleAddToCart() {
    if (!selectedId) return;
    setLoading(true);
    setError('');
    try {
      const checkoutUrl = await addToCart(selectedId, quantity);
      window.location.href = checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {showVariants && (
        <div className="flex flex-col gap-2">
          <label className="tac-label" style={{ fontSize: 9 }}>Option</label>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                disabled={!v.availableForSale}
                className="font-body font-bold transition-all"
                style={{
                  padding: '6px 14px',
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: 3,
                  border: selectedId === v.id
                    ? '1px solid rgba(201,162,39,0.8)'
                    : '1px solid rgba(201,162,39,0.25)',
                  background: selectedId === v.id ? 'rgba(201,162,39,0.12)' : 'transparent',
                  color: v.availableForSale ? '#EDD56A' : 'rgba(255,255,255,0.25)',
                  cursor: v.availableForSale ? 'pointer' : 'not-allowed',
                  textDecoration: v.availableForSale ? 'none' : 'line-through',
                }}
              >
                {v.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="tac-label" style={{ fontSize: 9 }}>Quantity</label>
        <div className="flex items-center gap-0" style={{ width: 'fit-content' }}>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="font-body font-bold text-brand-text transition-colors hover:text-gold"
            style={{
              width: 36,
              height: 36,
              border: '1px solid rgba(201,162,39,0.25)',
              borderRight: 'none',
              borderRadius: '3px 0 0 3px',
              background: 'rgba(255,255,255,0.03)',
              fontSize: 16,
              lineHeight: 1,
              cursor: 'pointer',
            }}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span
            className="font-body font-bold text-brand-text flex items-center justify-center"
            style={{
              width: 48,
              height: 36,
              border: '1px solid rgba(201,162,39,0.25)',
              background: 'rgba(255,255,255,0.03)',
              fontSize: 14,
            }}
          >
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="font-body font-bold text-brand-text transition-colors hover:text-gold"
            style={{
              width: 36,
              height: 36,
              border: '1px solid rgba(201,162,39,0.25)',
              borderLeft: 'none',
              borderRadius: '0 3px 3px 0',
              background: 'rgba(255,255,255,0.03)',
              fontSize: 16,
              lineHeight: 1,
              cursor: 'pointer',
            }}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={loading || !selectedId || available.length === 0}
        className="btn-gold"
        style={{
          padding: '12px 24px',
          fontSize: 12,
          opacity: loading || available.length === 0 ? 0.6 : 1,
          cursor: loading || available.length === 0 ? 'not-allowed' : 'pointer',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {available.length === 0
          ? 'SOLD OUT'
          : loading
          ? 'REDIRECTING TO CHECKOUT…'
          : 'ADD TO CART'}
      </button>

      {error && (
        <p className="font-body text-sm" style={{ color: '#e57373' }}>{error}</p>
      )}
    </div>
  );
}
