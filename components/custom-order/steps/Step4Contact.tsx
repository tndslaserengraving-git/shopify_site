'use client';
import type { WizardState, ContactMethod } from '@/types/wizard';

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
  submitError: string;
}

const inputCls =
  'w-full rounded-lg px-4 py-2.5 font-body text-sm text-brand-text bg-white/5 outline-none transition-all duration-150';
const inputStyle = { border: '1px solid rgba(237,235,230,0.12)' };
const inputFocusStyle = { border: '1px solid rgba(201,162,39,0.6)', boxShadow: '0 0 0 2px rgba(201,162,39,0.12)' };

export default function Step4Contact({ state, update, submitError }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <div className="section-rule" />
        <h2
          className="font-heading font-black text-brand-text mt-2 mb-1"
          style={{ fontSize: 'clamp(20px, 3vw, 26px)', letterSpacing: '-0.01em' }}
        >
          How can we reach you?
        </h2>
        <p className="font-body text-white/45 text-sm">
          We'll follow up within 24–48 hours.
        </p>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="font-body font-semibold text-brand-text text-sm block mb-1.5">
          Full Name <span style={{ color: '#C9A227' }}>*</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={state.name}
          onChange={(e) => update({ name: e.target.value })}
          className={inputCls}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="font-body font-semibold text-brand-text text-sm block mb-1.5">
          Email <span style={{ color: '#C9A227' }}>*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={state.email}
          onChange={(e) => update({ email: e.target.value })}
          className={inputCls}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="font-body font-semibold text-brand-text text-sm block mb-1.5">
          Phone <span className="font-normal text-white/35">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={state.phone}
          onChange={(e) => update({ phone: e.target.value })}
          className={inputCls}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
        />
      </div>

      {/* Contact method */}
      <div>
        <p className="font-body font-semibold text-brand-text text-sm mb-2">
          Preferred Contact Method
        </p>
        <div className="flex gap-3">
          {(['email', 'phone'] as ContactMethod[]).map((method) => (
            <button
              key={method}
              onClick={() => update({ contactMethod: method })}
              className="px-5 py-2 rounded-lg font-body text-sm font-semibold capitalize transition-all duration-150 cursor-pointer"
              style={
                state.contactMethod === method
                  ? { border: '2px solid #C9A227', background: 'rgba(201,162,39,0.07)', color: '#EDEBE6' }
                  : { border: '2px solid rgba(237,235,230,0.08)', background: 'transparent', color: 'rgba(237,235,230,0.4)' }
              }
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Submit error */}
      {submitError && (
        <div
          role="alert"
          className="p-4 rounded-lg"
          style={{ background: 'rgba(201,162,39,0.07)', border: '1px solid rgba(201,162,39,0.25)' }}
        >
          <p className="font-body text-sm" style={{ color: '#EDD56A' }}>{submitError}</p>
          <a
            href="mailto:topnotchdesignstudio@email.com"
            className="font-body text-xs underline mt-1 block transition-colors"
            style={{ color: '#C9A227' }}
          >
            Or email us directly
          </a>
        </div>
      )}
    </div>
  );
}
