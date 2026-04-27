import type { WizardState, ContactMethod } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
  submitError: string;
}

export default function Step4Contact({ state, update, submitError }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading font-bold text-navy text-2xl mb-1">
          How can we reach you?
        </h2>
        <p className="font-body text-brand-text/60 text-sm">
          We'll follow up within 24–48 hours.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="font-body font-semibold text-navy text-sm block mb-1.5">
          Full Name <span className="text-patriot-red">*</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={state.name}
          onChange={(e) => update({ name: e.target.value })}
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <label htmlFor="email" className="font-body font-semibold text-navy text-sm block mb-1.5">
          Email <span className="text-patriot-red">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={state.email}
          onChange={(e) => update({ email: e.target.value })}
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <label htmlFor="phone" className="font-body font-semibold text-navy text-sm block mb-1.5">
          Phone <span className="font-normal text-navy/40">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={state.phone}
          onChange={(e) => update({ phone: e.target.value })}
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <p className="font-body font-semibold text-navy text-sm mb-2">Preferred Contact Method</p>
        <div className="flex gap-3">
          {(['email', 'phone'] as ContactMethod[]).map((method) => (
            <button
              key={method}
              onClick={() => update({ contactMethod: method })}
              className={`px-4 py-2 rounded-lg border-2 font-body text-sm font-medium transition-all cursor-pointer capitalize ${
                state.contactMethod === method
                  ? 'border-patriot-red bg-patriot-red/5 text-navy'
                  : 'border-navy/15 text-navy/60 hover:border-navy/40'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {submitError && (
        <div role="alert" className="p-3 rounded-lg bg-patriot-red/10 border border-patriot-red/20">
          <p className="font-body text-sm text-patriot-red">{submitError}</p>
          <a href="mailto:topnotchdesignstudio@email.com" className="font-body text-xs text-steel underline mt-1 block">
            Or email us directly
          </a>
        </div>
      )}
    </div>
  );
}
