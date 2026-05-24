import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAdminRequest } from '@/lib/admin-sig';

export async function POST(request: NextRequest) {
  if (!validateAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { storagePath, altText, caption } = await request.json();

  if (!storagePath) {
    return NextResponse.json({ error: 'Missing storage path' }, { status: 400 });
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from('gallery').getPublicUrl(storagePath);

  const { data, error } = await supabaseAdmin
    .from('gallery_images')
    .insert({ storage_path: storagePath, public_url: publicUrl, alt_text: altText || '', caption: caption || null })
    .select()
    .single();

  if (error) {
    await supabaseAdmin.storage.from('gallery').remove([storagePath]);
    return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
