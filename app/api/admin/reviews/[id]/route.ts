import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAdminRequest, validateAdminToken } from '@/lib/admin-sig';

function htmlResponse(message: string, status = 200) {
  return new Response(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;background:#07070A;color:#fff"><p>${message}</p><a href="/reviews" style="color:#C9A227">View all reviews</a></body></html>`,
    { status, headers: { 'Content-Type': 'text/html' } },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') ?? '';
  const action = searchParams.get('action');

  if (!validateAdminToken(token)) return htmlResponse('Unauthorized.', 401);

  const { id } = params;
  const { data: review } = await supabaseAdmin
    .from('reviews')
    .select('id')
    .eq('id', id)
    .maybeSingle();
  if (!review) return htmlResponse('Review not found.', 404);

  if (action === 'approve') {
    const { error } = await supabaseAdmin.from('reviews').update({ approved: true }).eq('id', id);
    if (error) return htmlResponse('Failed to approve review.', 500);
    return htmlResponse('Review approved and published.');
  }

  if (action === 'verify') {
    const { error } = await supabaseAdmin
      .from('reviews')
      .update({ approved: true, verified_purchase: true })
      .eq('id', id);
    if (error) return htmlResponse('Failed to approve review.', 500);
    return htmlResponse('Review approved and marked as verified purchase.');
  }

  if (action === 'reject') {
    const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
    if (error) return htmlResponse('Failed to reject review.', 500);
    return htmlResponse('Review rejected and deleted.');
  }

  return htmlResponse('Invalid action.', 400);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!validateAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const { action } = body;
  const { id } = params;

  const { data: review } = await supabaseAdmin
    .from('reviews')
    .select('id')
    .eq('id', id)
    .maybeSingle();
  if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

  if (action === 'approve') {
    const { error } = await supabaseAdmin
      .from('reviews')
      .update({ approved: true })
      .eq('id', id);
    if (error) return NextResponse.json({ error: 'Failed to approve' }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'verify') {
    const { error } = await supabaseAdmin
      .from('reviews')
      .update({ approved: true, verified_purchase: true })
      .eq('id', id);
    if (error) return NextResponse.json({ error: 'Failed to verify' }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'reject') {
    const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
    if (error) return NextResponse.json({ error: 'Failed to reject' }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'action must be "approve", "verify", or "reject"' }, { status: 400 });
}
