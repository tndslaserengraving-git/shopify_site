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
    <div
      className="flex items-center justify-between mt-8 pt-6"
      style={{ borderTop: '1px solid rgba(237,235,230,0.08)' }}
    >
      {step > 1 ? (
        <button
          onClick={onBack}
          className="font-body text-sm font-semibold transition-colors duration-150 cursor-pointer"
          style={{ color: 'rgba(237,235,230,0.35)', letterSpacing: '0.04em' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#EDEBE6')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(237,235,230,0.35)')}
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
          className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending…' : 'Submit Request'}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      )}
    </div>
  );
}
