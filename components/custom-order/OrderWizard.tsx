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
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="text-4xl mb-4" aria-hidden="true">✅</div>
        <h2 className="font-heading font-bold text-navy text-3xl mb-3">Request Received!</h2>
        <p className="font-body text-brand-text/70 text-base mb-6">
          We'll be in touch within 24–48 hours.
        </p>
        <Link href="/shop" className="font-body text-steel hover:text-navy underline text-sm">
          Browse the shop while you wait →
        </Link>
      </div>
    );
  }

  const progress = ((state.step - 1) / 3) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={`font-body text-xs font-medium ${i + 1 <= state.step ? 'text-patriot-red' : 'text-brand-text/30'}`}
            >
              {label}
            </span>
          ))}
        </div>
        <div
          className="h-1.5 bg-navy/10 rounded-full"
          role="progressbar"
          aria-valuenow={state.step}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Step ${state.step} of 4`}
        >
          <div
            className="h-full bg-patriot-red rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
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
