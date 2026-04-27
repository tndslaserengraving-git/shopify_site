import OrderWizard from '@/components/custom-order/OrderWizard';

export const metadata = {
  title: 'Custom Order | Top Notch Design Studio',
};

export default function CustomOrderPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="bg-navy py-10 px-4 text-center">
        <h1 className="font-heading font-bold text-white text-3xl sm:text-4xl">
          Start a Custom Order
        </h1>
        <p className="font-body text-white/70 mt-2 text-sm">
          Tell us what you need and we'll bring it to life.
        </p>
      </div>
      <OrderWizard />
    </div>
  );
}
