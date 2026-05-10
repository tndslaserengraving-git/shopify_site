'use server';
import { createCart } from '@/lib/shopify';

export async function addToCart(
  variantId: string,
  quantity: number,
  attributes?: { key: string; value: string }[],
): Promise<string> {
  return createCart(variantId, quantity, attributes);
}
