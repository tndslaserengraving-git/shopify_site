import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/review-token';
import ReviewForm from './ReviewForm';

function ErrorPage({ message }: { message: string }) {
  return (
    <div style={{ background: '#07070A', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="font-body text-white/50 text-lg mb-6">{message}</p>
        <a href="/reviews" className="btn-gold" style={{ padding: '9px 20px', fontSize: 11 }}>
          VIEW ALL REVIEWS
        </a>
      </div>
    </div>
  );
}

export default async function VerifiedReviewPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { order?: string; product?: string; name?: string; email?: string };
}) {
  const { token } = params;
  const { order, product, name, email } = searchParams;

  if (!order || !product || !email) {
    return <ErrorPage message="This review link is invalid or incomplete." />;
  }

  if (!verifyToken(token, order, product, email)) {
    return <ErrorPage message="This review link is invalid or has expired." />;
  }

  const { data: existing } = await supabaseAdmin
    .from('reviews')
    .select('id')
    .eq('token_used', token)
    .maybeSingle();

  if (existing) {
    return <ErrorPage message="You've already submitted a review with this link." />;
  }

  return (
    <div style={{ background: '#07070A', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-heading text-4xl font-black text-brand-text mb-3">
          Leave a Review
        </h1>
        <p className="font-body text-white/50 mb-10">
          Your purchase has been verified. Your review will be published immediately.
        </p>
        <ReviewForm
          token={token}
          orderId={order}
          productHandle={product}
          authorName={name ?? ''}
          email={email}
        />
      </div>
    </div>
  );
}
