import { Shield } from 'lucide-react';

export default function VeteranStory() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-patriot-red rounded-full" aria-hidden="true" />
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-patriot-red" size={18} aria-hidden="true" />
            <span className="font-body text-patriot-red font-semibold text-xs uppercase tracking-widest">
              Our Story
            </span>
          </div>
          <h2 className="font-heading font-bold text-navy text-3xl sm:text-4xl mb-4 leading-tight">
            Built on Service.
            <br />
            <span className="text-patriot-red">Crafted with Pride.</span>
          </h2>
          <p className="font-body text-brand-text/75 text-base leading-relaxed mb-4">
            Top Notch Design Studio was founded by a U.S. military veteran who brought
            the same discipline, attention to detail, and commitment to excellence from
            service into every engraved piece we create.
          </p>
          <p className="font-body text-brand-text/75 text-base leading-relaxed">
            Whether it&apos;s a personalized gift for a loved one, branded materials for your
            business, or a commemorative piece — every order is treated with the care it
            deserves.
          </p>
        </div>
        <div className="bg-navy/5 rounded-2xl aspect-square flex items-center justify-center">
          <span className="font-body text-navy/30 text-sm">Owner photo coming soon</span>
        </div>
      </div>
    </section>
  );
}
