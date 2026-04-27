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
      <h2 className="font-heading font-bold text-navy text-2xl mb-2">
        What are you looking to engrave?
      </h2>
      <p className="font-body text-brand-text/60 text-sm mb-6">Select a product type to continue.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PRODUCT_TYPES.map(([value, label]) => (
          <button
            key={value}
            onClick={() => update({ productType: value })}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
              state.productType === value
                ? 'border-patriot-red bg-patriot-red/5 text-navy'
                : 'border-navy/15 hover:border-navy/40 text-brand-text/70'
            }`}
          >
            <span className="font-body font-semibold text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
