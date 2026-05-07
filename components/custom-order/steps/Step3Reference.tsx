'use client';
import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import type { WizardState } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
}

const inputCls =
  'w-full rounded-lg px-4 py-2.5 font-body text-sm text-brand-text bg-white/5 outline-none transition-all duration-150';
const inputStyle = { border: '1px solid rgba(237,235,230,0.12)' };
const inputFocusStyle = { border: '1px solid rgba(201,162,39,0.6)', boxShadow: '0 0 0 2px rgba(201,162,39,0.12)' };

export default function Step3Reference({ state, update }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    update({ referenceImage: file });
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="section-rule" />
        <h2
          className="font-heading font-black text-brand-text mt-2 mb-1"
          style={{ fontSize: 'clamp(20px, 3vw, 26px)', letterSpacing: '-0.01em' }}
        >
          Reference &amp; Notes
        </h2>
        <p className="font-body text-white/45 text-sm">
          Optional — upload a logo, photo, or design idea. Add any extra details below.
        </p>
      </div>

      {/* File drop zone */}
      <div>
        <p className="font-body font-semibold text-brand-text text-sm mb-2">
          Reference Image <span className="font-normal text-white/35">(optional)</span>
        </p>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
          className="rounded-lg p-8 text-center cursor-pointer transition-all duration-150"
          style={{
            border: '2px dashed rgba(201,162,39,0.2)',
            background: 'rgba(201,162,39,0.03)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.4)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(201,162,39,0.06)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.2)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(201,162,39,0.03)';
          }}
        >
          {state.referenceImage ? (
            <div className="flex items-center justify-center gap-3">
              <span className="font-body text-sm text-brand-text font-medium">
                {state.referenceImage.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  update({ referenceImage: null });
                }}
                className="cursor-pointer transition-colors duration-150"
                style={{ color: '#C9A227' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#EDD56A')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#C9A227')}
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div>
              <Upload
                className="mx-auto mb-2"
                size={26}
                style={{ color: 'rgba(201,162,39,0.4)' }}
                aria-hidden="true"
              />
              <p className="font-body text-sm text-white/45">
                Drag &amp; drop or{' '}
                <span style={{ color: '#C9A227', textDecoration: 'underline' }}>browse</span>
              </p>
              <p className="font-body text-xs text-white/25 mt-1">
                JPG, PNG, SVG, PDF up to 10MB
              </p>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf,.svg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="font-body font-semibold text-brand-text text-sm block mb-1.5">
          Additional Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={state.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Any other details, font preferences, inspiration, deadline…"
          className={inputCls + ' resize-none'}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
        />
      </div>
    </div>
  );
}
