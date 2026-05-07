'use client';
import { useState } from 'react';
import type { WizardState } from '@/types/wizard';
import { initialWizardState } from '@/types/wizard';
import Step1ProductType from './steps/Step1ProductType';
import Step2Details from './steps/Step2Details';
import Step3Reference from './steps/Step3Reference';
import Step4Contact from './steps/Step4Contact';
import WizardNavigation from './WizardNavigation';
import Link from 'next/link';
import { Check } from 'lucide-react';

const STEP_LABELS = ['Product Type', 'Details', 'Reference', 'Contact'];

function canAdvance(state: WizardState): boolean {
  if (state.step === 1) return state.productType !== '';
  if (state.step === 2) return state.engraveText.trim() !== '' && state.size !== '';
  if (state.step === 3) return true;
  if (state.step === 4) return state.name.trim() !== '' && state.email.trim() !== '';
  return false;
}

export default function OrderWizard() {
  const [state, setState] = useState<WizardState>(initialWizardState);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(partial: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function next() {
    setState((prev) => ({
      ...prev,
      step: Math.min(4, prev.step + 1) as WizardState['step'],
    }));
  }

  function back() {
    setSubmitError('');
    setState((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1) as WizardState['step'],
    }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const formData = new FormData();
      (Object.entries(state) as [string, unknown][]).forEach(([k, v]) => {
        if (k === 'step') return;
        if (v instanceof File) formData.append(k, v);
        else if (v !== null && v !== undefined) formData.append(k, String(v));
      });
      const res = await fetch('/api/custom-order', { method: 'POST', body: formData });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitError('Something went wrong. Please try again or contact us directly.');
      }
    } catch {
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'rgba(201,162,39,0.1)',
            border: '1px solid rgba(201,162,39,0.3)',
            color: '#C9A227',
          }}
        >
          <Check size={28} aria-hidden="true" />
        </div>
        <div className="section-rule mx-auto mb-3" />
        <h2
          className="font-heading font-black text-brand-text mb-3"
          style={{ fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '-0.02em' }}
        >
          Request Received!
        </h2>
        <p className="font-body text-white/45 text-base mb-8">
          We'll be in touch within 24–48 hours.
        </p>
        <Link
          href="/shop"
          className="font-body font-semibold text-sm transition-colors duration-150"
          style={{ color: '#C9A227', textDecoration: 'underline' }}
        >
          Browse the shop while you wait →
        </Link>
      </div>
    );
  }

  const progress = ((state.step - 1) / 3) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex justify-between mb-3">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className="font-body font-bold"
              style={{
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: i + 1 <= state.step ? '#C9A227' : 'rgba(237,235,230,0.2)',
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(237,235,230,0.08)' }}
          role="progressbar"
          aria-valuenow={state.step}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Step ${state.step} of 4`}
        >
          <div
            className="h-full rounded-full transition-all duration-400"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #7A5C10, #C9A227 50%, #EDD56A)',
            }}
          />
        </div>
      </div>

      {state.step === 1 && <Step1ProductType state={state} update={update} />}
      {state.step === 2 && <Step2Details state={state} update={update} />}
      {state.step === 3 && <Step3Reference state={state} update={update} />}
      {state.step === 4 && (
        <Step4Contact state={state} update={update} submitError={submitError} />
      )}

      <WizardNavigation
        step={state.step}
        canAdvance={canAdvance(state)}
        onBack={back}
        onNext={state.step < 4 ? next : undefined}
        onSubmit={state.step === 4 ? handleSubmit : undefined}
        isLastStep={state.step === 4}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
