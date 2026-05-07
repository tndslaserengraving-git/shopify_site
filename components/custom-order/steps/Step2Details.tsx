'use client';
import type { WizardState, DesignStyle, Material } from '@/types/wizard';
import { SIZE_OPTIONS, MATERIAL_LABELS } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
}

const DESIGN_STYLES: { value: DesignStyle; label: string; desc: string }[] = [
  { value: 'text',    label: 'Simple Text',    desc: 'Names, dates, quotes' },
  { value: 'artwork', label: 'Custom Artwork',  desc: "I'll describe my design" },
  { value: 'upload',  label: 'Upload My Own',   desc: 'I have a file ready' },
];

const inputCls =
  'w-full rounded-lg px-4 py-2.5 font-body text-sm text-brand-text bg-white/5 outline-none transition-all duration-150';
const inputStyle = { border: '1px solid rgba(237,235,230,0.12)' };
const inputFocusStyle = { border: '1px solid rgba(201,162,39,0.6)', boxShadow: '0 0 0 2px rgba(201,162,39,0.12)' };

function goldSelected(selected: boolean) {
  return selected
    ? { border: '2px solid #C9A227', background: 'rgba(201,162,39,0.07)', color: '#EDEBE6' }
    : { border: '2px solid rgba(237,235,230,0.08)', background: 'transparent', color: 'rgba(237,235,230,0.4)' };
}

export default function Step2Details({ state, update }: Props) {
  const sizeOptions =
    state.productType && state.productType in SIZE_OPTIONS
      ? SIZE_OPTIONS[state.productType as keyof typeof SIZE_OPTIONS]
      : ['Custom'];

  return (
    <div className="space-y-6">
      <div>
        <div className="section-rule" />
        <h2
          className="font-heading font-black text-brand-text mt-2 mb-1"
          style={{ fontSize: 'clamp(20px, 3vw, 26px)', letterSpacing: '-0.01em' }}
        >
          Tell us about your engraving
        </h2>
        <p className="font-body text-white/45 text-sm">
          Fill in as much as you know — we'll follow up with questions.
        </p>
      </div>

      {/* Text to engrave */}
      <div>
        <label htmlFor="engraveText" className="font-body font-semibold text-brand-text text-sm block mb-1.5">
          Text to Engrave <span style={{ color: '#C9A227' }}>*</span>
        </label>
        <input
          id="engraveText"
          type="text"
          value={state.engraveText}
          onChange={(e) => update({ engraveText: e.target.value })}
          placeholder="e.g. The Johnson Family · Est. 2019"
          className={inputCls}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
        />
      </div>

      {/* Size + Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="size" className="font-body font-semibold text-brand-text text-sm block mb-1.5">
            Size <span style={{ color: '#C9A227' }}>*</span>
          </label>
          <select
            id="size"
            value={state.size}
            onChange={(e) => update({ size: e.target.value })}
            className={inputCls + ' cursor-pointer'}
            style={{ ...inputStyle, background: '#111214' }}
            onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputFocusStyle, background: '#111214' })}
            onBlur={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, background: '#111214' })}
          >
            <option value="">Select…</option>
            {sizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="font-body font-semibold text-brand-text text-sm block mb-1.5">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={500}
            value={state.quantity}
            onChange={(e) => update({ quantity: Math.max(1, Number(e.target.value)) })}
            className={inputCls}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
          />
        </div>
      </div>

      {/* Material */}
      <div>
        <p className="font-body font-semibold text-brand-text text-sm mb-2">Material</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {(Object.entries(MATERIAL_LABELS) as [Material, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => update({ material: state.material === value ? '' : value })}
              className="p-3 rounded-lg text-center transition-all duration-150 cursor-pointer"
              style={goldSelected(state.material === value)}
            >
              <span className="font-body font-semibold text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Design Style */}
      <div>
        <p className="font-body font-semibold text-brand-text text-sm mb-2">Design Style</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DESIGN_STYLES.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => update({ designStyle: value })}
              className="p-3 rounded-lg text-left transition-all duration-150 cursor-pointer"
              style={goldSelected(state.designStyle === value)}
            >
              <p className="font-body font-semibold text-brand-text text-sm">{label}</p>
              <p className="font-body text-white/45 text-xs mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
