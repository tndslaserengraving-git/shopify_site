import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAdminRequest } from '@/lib/admin-sig';

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

  if (action === 'approve') {
    const { error } = await supabaseAdmin
      .from('reviews')
      .update({ approved: true })
      .eq('id', id);
    if (error) return NextResponse.json({ error: 'Failed to approve' }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'reject') {
    const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
    if (error) return NextResponse.json({ error: 'Failed to reject' }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'action must be "approve" or "reject"' }, { status: 400 });
}
