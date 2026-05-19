import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateAdminRequest } from '@/lib/admin-sig';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Fetch the row so we know the storage path to delete
  const { data: image, error: fetchError } = await supabaseAdmin
    .from('gallery_images')
    .select('storage_path')
    .eq('id', id)
    .single();

  if (fetchError || !image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  const { error: dbError } = await supabaseAdmin
    .from('gallery_images')
    .delete()
    .eq('id', id);

  if (dbError) {
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }

  // Best-effort storage removal — don't fail the response if this errors
  await supabaseAdmin.storage.from('gallery').remove([image.storage_path]);

  return new NextResponse(null, { status: 204 });
}
