'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/app/shop/[handle]/actions';
import { formatPrice } from '@/lib/shopify';
import type { ShopifyVariant } from '@/lib/shopify';

interface Props {
  variants: ShopifyVariant[];
  requiresCustomization?: boolean;
  productTitle?: string;
}

function customOrderSlug(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('wine caddy') || t.includes('wine rack')) return 'wine-caddy';
  if (t.includes('cutting board')) return 'cutting-board';
  if (t.includes('business card')) return 'business-cards';
  if (t.includes('granite')) return 'granite';
  if (t.includes('acrylic')) return 'acrylic';
  return 'other';
}

const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.pdf,.svg,.ai,.eps';

export default function AddToCart({ variants, requiresCustomization = false, productTitle = '' }: Props) {
  const router = useRouter();
  const available = variants.filter((v) => v.availableForSale);
  const [selectedId, setSelectedId] = useState(available[0]?.id ?? variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [personalization, setPersonalization] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const showVariants = variants.length > 1 || (variants.length === 1 && variants[0].title !== 'Default Title');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : '');
  }

  const selectedVariant = variants.find((v) => v.id === selectedId);
  const isCustomVariant = selectedVariant?.title.toLowerCase().startsWith('custom');

  async function handleAddToCart() {
    if (!selectedId) return;

    // "Custom" variant → send to custom order builder pre-selecting this product
    if (isCustomVariant && productTitle) {
      const slug = customOrderSlug(productTitle);
      router.push(`/custom-order?product=${slug}`);
      return;
    }

    if (requiresCustomization && !personalization.trim()) {
      setError('Please enter your personalization text before adding to cart.');
      return;
    }
    setLoading(true);
    setError('');

    const attributes: { key: string; value: string }[] = [];
    if (requiresCustomization) {
      attributes.push({ key: 'Personalization', value: personalization.trim() });
      if (fileName) {
        attributes.push({
          key: 'Design File',
          value: `${fileName} – please email your file to us via the Contact page after checkout`,
        });
      }
    }

    try {
      const checkoutUrl = await addToCart(selectedId, quantity, attributes.length ? attributes : undefined);
      window.location.href = checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setLoading(false);
    }
  }

  const displayPrice = selectedVariant
    ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : null;

  return (
    <div className="flex flex-col gap-5">
      {displayPrice && (
        <p className="font-body font-bold text-2xl" style={{ color: '#C9A227' }}>
          {displayPrice}
        </p>
      )}

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

      {requiresCustomization && (
        <>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="personalization"
              className="tac-label"
              style={{ fontSize: 9 }}
            >
              Personalization / Engraving Text <span style={{ color: '#e57373' }}>*</span>
            </label>
            <textarea
              id="personalization"
              rows={3}
              placeholder="Enter the name, message, or text to be engraved…"
              value={personalization}
              onChange={(e) => setPersonalization(e.target.value)}
              className="font-body text-brand-text resize-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,162,39,0.25)',
                borderRadius: 3,
                padding: '10px 12px',
                fontSize: 13,
                lineHeight: 1.5,
                outline: 'none',
                width: '100%',
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="tac-label" style={{ fontSize: 9 }}>
              Upload Design File <span className="font-body normal-case" style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>(optional — JPG, PNG, PDF, SVG, AI)</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-3 cursor-pointer transition-colors"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(201,162,39,0.3)',
                borderRadius: 3,
                padding: '10px 14px',
              }}
            >
              <span className="font-body text-white/30" style={{ fontSize: 11 }}>
                {fileName || 'Click to choose file…'}
              </span>
              {fileName && (
                <button
                  onClick={(e) => { e.stopPropagation(); setFileName(''); if (fileRef.current) fileRef.current.value = ''; }}
                  className="font-body text-white/30 hover:text-white/60 transition-colors ml-auto"
                  style={{ fontSize: 11 }}
                  aria-label="Remove file"
                >
                  ✕
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={handleFile}
              className="sr-only"
              aria-label="Upload design file"
            />
            {fileName && (
              <p className="font-body text-white/35" style={{ fontSize: 11, lineHeight: 1.5 }}>
                After checkout, please email your file to us via the{' '}
                <a href="/contact" className="underline hover:text-white/60 transition-colors">Contact page</a>.
                We&apos;ll confirm receipt before starting your order.
              </p>
            )}
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        <label className="tac-label" style={{ fontSize: 9 }}>Quantity</label>
        <div className="flex items-center gap-0" style={{ width: 'fit-content' }}>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="font-body font-bold text-brand-text transition-colors hover:text-gold"
            style={{
              width: 36, height: 36,
              border: '1px solid rgba(201,162,39,0.25)',
              borderRight: 'none',
              borderRadius: '3px 0 0 3px',
              background: 'rgba(255,255,255,0.03)',
              fontSize: 16, lineHeight: 1, cursor: 'pointer',
            }}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span
            className="font-body font-bold text-brand-text flex items-center justify-center"
            style={{
              width: 48, height: 36,
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
              width: 36, height: 36,
              border: '1px solid rgba(201,162,39,0.25)',
              borderLeft: 'none',
              borderRadius: '0 3px 3px 0',
              background: 'rgba(255,255,255,0.03)',
              fontSize: 16, lineHeight: 1, cursor: 'pointer',
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
          ? 'REDIRECTING…'
          : isCustomVariant
          ? 'START CUSTOM ORDER'
          : 'ADD TO CART'}
      </button>

      {error && (
        <p className="font-body text-sm" style={{ color: '#e57373' }}>{error}</p>
      )}
    </div>
  );
}
