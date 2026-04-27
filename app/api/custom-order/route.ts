import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const productType = (formData.get('productType') as string | null) ?? '';

  if (!name || !email || !productType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const referenceImage = formData.get('referenceImage') as File | null;
  const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
  if (referenceImage instanceof File && referenceImage.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image too large (max 10 MB)' }, { status: 413 });
  }

  try {
    await sendOrderEmail({
      name,
      email,
      productType,
      engraveText: (formData.get('engraveText') as string) ?? '',
      size: (formData.get('size') as string) ?? '',
      quantity: Number(formData.get('quantity') ?? 1),
      material: (formData.get('material') as string) ?? '',
      designStyle: (formData.get('designStyle') as string) ?? '',
      notes: (formData.get('notes') as string) ?? '',
      phone: (formData.get('phone') as string) ?? '',
      contactMethod: (formData.get('contactMethod') as string) ?? 'email',
      referenceImage,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Order email failed:', err);
    return NextResponse.json({ error: 'Failed to send order' }, { status: 500 });
  }
}
