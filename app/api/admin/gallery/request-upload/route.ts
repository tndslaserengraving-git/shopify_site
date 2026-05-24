import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAdminRequest } from '@/lib/admin-sig';

export async function POST(request: NextRequest) {
  if (!validateAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { filename } = await request.json();
  const ext = (filename?.split('.').pop() ?? 'jpg').toLowerCase();
  const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from('gallery')
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl, storagePath });
}
