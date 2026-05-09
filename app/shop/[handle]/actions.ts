'use server';
import { createCart } from '@/lib/shopify';

export async function addToCart(variantId: string, quantity: number): Promise<string> {
  return createCart(variantId, quantity);
}
