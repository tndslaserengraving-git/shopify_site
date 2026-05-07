'use client';
import type { WizardState, ProductType } from '@/types/wizard';
import { PRODUCT_TYPE_LABELS } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
}

const PRODUCT_TYPES = Object.entries(PRODUCT_TYPE_LABELS) as [ProductType, string][];

export default function Step1ProductType({ state, update }: Props) {
  return (
    <div>
      <div className="section-rule" />
      <h2
        className="font-heading font-black text-brand-text mt-2 mb-1"
        style={{ fontSize: 'clamp(20px, 3vw, 26px)', letterSpacing: '-0.01em' }}
      >
        What are you looking to engrave?
      </h2>
      <p className="font-body text-white/45 text-sm mb-6">
        Select a product type to continue.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PRODUCT_TYPES.map(([value, label]) => (
          <button
            key={value}
            onClick={() => update({ productType: value })}
            className="p-4 rounded-lg text-left transition-all duration-150 cursor-pointer"
            style={
              state.productType === value
                ? {
                    border: '2px solid #C9A227',
                    background: 'rgba(201,162,39,0.07)',
                    color: '#EDEBE6',
                  }
                : {
                    border: '2px solid rgba(237,235,230,0.08)',
                    background: 'transparent',
                    color: 'rgba(237,235,230,0.4)',
                  }
            }
            onMouseEnter={(e) => {
              if (state.productType !== value) {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.35)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(237,235,230,0.7)';
              }
            }}
            onMouseLeave={(e) => {
              if (state.productType !== value) {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(237,235,230,0.08)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(237,235,230,0.4)';
              }
            }}
          >
            <span className="font-body font-semibold text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
