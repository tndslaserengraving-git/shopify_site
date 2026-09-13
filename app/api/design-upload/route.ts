import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { randomUUID } from 'crypto';

// Design files (unlike review photos) need to support PDF/SVG/AI/EPS on top
// of plain images, and can reasonably be a bit larger since some are
// print-ready vector/design files rather than casual phone photos.
const MAX_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'image/svg+xml',
  'application/postscript', // .ai / .eps commonly report as this
  'application/illustrator',
  'application/octet-stream', // fallback some browsers use for .ai/.eps
];

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Only JPG, PNG, PDF, SVG, AI, and EPS files are allowed' },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File must be under 15MB' }, { status: 400 });
  }

  // Keep the original extension from the filename (more reliable than
  // file.type for design files like .ai/.eps, which browsers report
  // inconsistently).
  const originalExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const filename = `${Date.now()}-${randomUUID()}.${originalExt}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from('design-files')
    .upload(filename, bytes, { contentType: file.type || 'application/octet-stream' });

  if (error) {
    console.error('Design file upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('design-files')
    .getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl, originalName: file.name });
}
