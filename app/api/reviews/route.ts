import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/review-token';
import { sendReviewNotificationEmail } from '@/lib/resend';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const { product_handle, author_name, rating, body: reviewBody, token, order_id, email } = body;

  if (!product_handle?.trim() || !author_name?.trim() || !reviewBody?.trim()) {
    return NextResponse.json(
      { error: 'product_handle, author_name, and body are required' },
      { status: 400 },
    );
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: 'rating must be an integer between 1 and 5' },
      { status: 400 },
    );
  }

  let verified_purchase = false;
  let approved = false;
  let token_used: string | null = null;

  if (token) {
    if (!order_id || !email) {
      return NextResponse.json(
        { error: 'order_id and email are required when submitting with a token' },
        { status: 400 },
      );
    }
    if (!verifyToken(token, order_id, product_handle, email)) {
      return NextResponse.json({ error: 'Invalid review token' }, { status: 400 });
    }
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('token_used', token)
      .maybeSingle();
    if (checkError) {
      return NextResponse.json({ error: 'Failed to validate token' }, { status: 500 });
    }
    if (existing) {
      return NextResponse.json({ error: 'Token has already been used' }, { status: 400 });
    }
    verified_purchase = true;
    approved = true;
    token_used = token;
  }

  const { data: inserted, error } = await supabaseAdmin
    .from('reviews')
    .insert({
      product_handle: product_handle.trim(),
      author_name: author_name.trim(),
      rating,
      body: reviewBody.trim(),
      verified_purchase,
      approved,
      token_used,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Review insert error:', error);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }

  sendReviewNotificationEmail({
    id: inserted.id,
    author_name: author_name.trim(),
    product_handle: product_handle.trim(),
    rating,
    body: reviewBody.trim(),
    verified_purchase,
  }).catch((err) => console.error('Review notification error:', err));

  return NextResponse.json({ success: true }, { status: 201 });
}
