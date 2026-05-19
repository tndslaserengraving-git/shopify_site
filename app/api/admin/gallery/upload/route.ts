import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAdminRequest } from '@/lib/admin-sig';

export async function POST(request: NextRequest) {
  if (!validateAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const altText = (formData.get('alt_text') as string) ?? '';
  const caption = (formData.get('caption') as string) || null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await supabaseAdmin.storage
    .from('gallery')
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: 'Storage upload failed', detail: uploadError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from('gallery').getPublicUrl(storagePath);

  const { data, error: dbError } = await supabaseAdmin
    .from('gallery_images')
    .insert({ storage_path: storagePath, public_url: publicUrl, alt_text: altText, caption })
    .select()
    .single();

  if (dbError) {
    await supabaseAdmin.storage.from('gallery').remove([storagePath]);
    return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
