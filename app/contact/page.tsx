import { Mail, ExternalLink, Camera } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading font-bold text-white text-4xl mb-2">Contact Us</h1>
      <p className="font-body text-white/50 mb-10">
        Questions, custom requests, or just want to say hello — we'd love to hear from you.
      </p>

      <div className="space-y-6">
        <a
          href="mailto:topnotchdesignstudio@email.com"
          className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
        >
          <Mail className="text-patriot-red flex-shrink-0" size={24} aria-hidden="true" />
          <div>
            <p className="font-body font-semibold text-white text-sm">Email</p>
            <p className="font-body text-white/50 text-sm group-hover:text-patriot-red transition-colors">
              topnotchdesignstudio@email.com
            </p>
          </div>
        </a>

        <a
          href="https://www.etsy.com/shop/tndslaserengraving"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
        >
          <ExternalLink className="text-patriot-red flex-shrink-0" size={24} aria-hidden="true" />
          <div>
            <p className="font-body font-semibold text-white text-sm">Etsy Shop</p>
            <p className="font-body text-white/50 text-sm group-hover:text-patriot-red transition-colors">
              etsy.com/shop/tndslaserengraving
            </p>
          </div>
        </a>

        <a
          href="https://www.instagram.com/tndslaserengraving"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 rounded-xl bg-navy/5 hover:bg-white/5 transition-colors"
        >
          <Camera className="text-patriot-red flex-shrink-0" size={24} aria-hidden="true" />
          <div>
            <p className="font-body font-semibold text-white text-sm">Instagram</p>
            <p className="font-body text-white/50 text-sm">@tndslaserengraving</p>
          </div>
        </a>
      </div>

      <div className="mt-10 p-6 bg-navy rounded-xl text-center">
        <p className="font-body text-white/80 text-sm mb-3">
          Ready to place a custom order?
        </p>
        <a
          href="/custom-order"
          className="inline-block bg-patriot-red hover:bg-patriot-red-dark text-white font-body font-semibold px-6 py-2.5 rounded-md transition-colors text-sm cursor-pointer"
        >
          Start Custom Order
        </a>
      </div>
    </div>
  );
}
