interface Props {
  step: number;
  canAdvance: boolean;
  onBack: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isLastStep: boolean;
  isSubmitting?: boolean;
}

export default function WizardNavigation({
  step,
  canAdvance,
  onBack,
  onNext,
  onSubmit,
  isLastStep,
  isSubmitting = false,
}: Props) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy/10">
      {step > 1 ? (
        <button
          onClick={onBack}
          className="font-body text-sm font-medium text-navy/60 hover:text-navy transition-colors cursor-pointer"
        >
          ← Back
        </button>
      ) : (
        <div />
      )}

      {isLastStep ? (
        <button
          onClick={onSubmit}
          disabled={!canAdvance || isSubmitting}
          className="bg-patriot-red hover:bg-patriot-red-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-semibold px-6 py-2.5 rounded-md transition-colors cursor-pointer"
        >
          {isSubmitting ? 'Sending…' : 'Submit Request'}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="bg-navy hover:bg-navy/80 disabled:opacity-40 disabled:cursor-not-allowed text-white font-body font-semibold px-6 py-2.5 rounded-md transition-colors cursor-pointer"
        >
          Next →
        </button>
      )}
    </div>
  );
}
