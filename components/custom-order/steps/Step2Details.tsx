'use client';
import type { WizardState, DesignStyle } from '@/types/wizard';
import { SIZE_OPTIONS } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
}

const DESIGN_STYLES: { value: DesignStyle; label: string; desc: string }[] = [
  { value: 'text', label: 'Simple Text', desc: 'Names, dates, quotes' },
  { value: 'artwork', label: 'Custom Artwork', desc: 'I\'ll describe my design' },
  { value: 'upload', label: 'Upload My Own', desc: 'I have a file ready' },
];

export default function Step2Details({ state, update }: Props) {
  const sizeOptions =
    state.productType && state.productType in SIZE_OPTIONS
      ? SIZE_OPTIONS[state.productType as keyof typeof SIZE_OPTIONS]
      : ['Custom'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-navy text-2xl mb-1">
          Tell us about your engraving
        </h2>
        <p className="font-body text-brand-text/60 text-sm">Fill in as much as you know — we'll follow up with questions.</p>
      </div>

      <div>
        <label htmlFor="engraveText" className="font-body font-semibold text-navy text-sm block mb-1.5">
          Text to Engrave <span className="text-patriot-red">*</span>
        </label>
        <input
          id="engraveText"
          type="text"
          value={state.engraveText}
          onChange={(e) => update({ engraveText: e.target.value })}
          placeholder="e.g. The Johnson Family · Est. 2019"
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="size" className="font-body font-semibold text-navy text-sm block mb-1.5">
            Size <span className="text-patriot-red">*</span>
          </label>
          <select
            id="size"
            value={state.size}
            onChange={(e) => update({ size: e.target.value })}
            className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy bg-white cursor-pointer"
          >
            <option value="">Select…</option>
            {sizeOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="font-body font-semibold text-navy text-sm block mb-1.5">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={500}
            value={state.quantity}
            onChange={(e) => update({ quantity: Math.max(1, Number(e.target.value)) })}
            className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>
      </div>

      {(state.productType === 'cutting-board' || state.productType === 'granite') && (
        <div>
          <label htmlFor="material" className="font-body font-semibold text-navy text-sm block mb-1.5">
            Material Preference
          </label>
          <input
            id="material"
            type="text"
            value={state.material}
            onChange={(e) => update({ material: e.target.value })}
            placeholder="e.g. Maple, Walnut, Cherry…"
            className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>
      )}

      <div>
        <p className="font-body font-semibold text-navy text-sm mb-2">Design Style</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DESIGN_STYLES.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => update({ designStyle: value })}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                state.designStyle === value
                  ? 'border-patriot-red bg-patriot-red/5'
                  : 'border-navy/15 hover:border-navy/40'
              }`}
            >
              <p className="font-body font-semibold text-navy text-sm">{label}</p>
              <p className="font-body text-brand-text/60 text-xs mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
