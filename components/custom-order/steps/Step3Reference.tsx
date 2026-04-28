'use client';
import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import type { WizardState } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
}

export default function Step3Reference({ state, update }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    update({ referenceImage: file });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-white text-2xl mb-1">
          Reference &amp; Notes
        </h2>
        <p className="font-body text-white/50 text-sm">
          Optional — upload a logo, photo, or design idea. Add any extra details below.
        </p>
      </div>

      <div>
        <p className="font-body font-semibold text-white text-sm mb-2">Reference Image (optional)</p>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center cursor-pointer hover:border-white/25 transition-colors"
        >
          {state.referenceImage ? (
            <div className="flex items-center justify-center gap-3">
              <span className="font-body text-sm text-white font-medium">
                {state.referenceImage.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  update({ referenceImage: null });
                }}
                className="text-patriot-red hover:text-patriot-red-dark cursor-pointer"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto text-white/30 mb-2" size={28} aria-hidden="true" />
              <p className="font-body text-sm text-white/50">
                Drag &amp; drop or <span className="text-steel underline">browse</span>
              </p>
              <p className="font-body text-xs text-white/30 mt-1">JPG, PNG, SVG, PDF up to 10MB</p>
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

      <div>
        <label htmlFor="notes" className="font-body font-semibold text-white text-sm block mb-1.5">
          Additional Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={state.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Any other details, font preferences, inspiration, deadline…"
          className="w-full border border-white/15 rounded-lg px-4 py-2.5 font-body text-sm text-white bg-white/5 focus:outline-none focus:border-patriot-red focus:ring-1 focus:ring-patriot-red resize-none"
        />
      </div>
    </div>
  );
}
