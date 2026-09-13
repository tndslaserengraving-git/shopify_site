import type { ShopifyVariant, ShopifyProductOption } from './shopify';

// Preferred: Shopify's own native "option value swatch" feature (set in
// Admin via the swatch icon next to an option). This is the reliable
// source of truth for a thumbnail per Color/Patch value.
export function swatchImage(
  options: ShopifyProductOption[],
  name: string,
  value: string,
): string | null {
  const option = options.find((o) => o.name === name);
  const optionValue = option?.optionValues.find((v) => v.name === value);
  return optionValue?.swatchImageUrl ?? null;
}

// Fallback for products that haven't set up native swatches yet: reuse
// whichever variant with this option/value happens to have its own image.
export function findOptionImage(
  variants: ShopifyVariant[],
  name: string,
  value: string,
): string | null {
  const match = variants.find((v) =>
    v.selectedOptions.some((o) => o.name === name && o.value === value),
  );
  return match?.image?.url ?? null;
}

// Best available thumbnail for an option value: prefers Shopify's native
// swatch, falls back to the variant-image trick if no swatch is set yet.
export function optionThumbnail(
  options: ShopifyProductOption[],
  variants: ShopifyVariant[],
  name: string,
  value: string,
): string | null {
  return swatchImage(options, name, value) ?? findOptionImage(variants, name, value);
}

// Identifies which option name represents the "main" product identity
// (e.g. hat color) as opposed to an add-on option (e.g. patch style).
// Anything literally named "Color" (case-insensitive) wins; otherwise
// falls back to the first option so single-option products still work.
export function primaryOptionName(optionNames: string[]): string | undefined {
  return optionNames.find((n) => /color/i.test(n)) ?? optionNames[0];
}

// Puts the "Color"-style option first and everything else (e.g. Patch)
// after it, regardless of the order Shopify happens to store them in.
export function orderedOptionNames(optionNames: string[]): string[] {
  const primary = primaryOptionName(optionNames);
  if (!primary) return optionNames;
  return [primary, ...optionNames.filter((n) => n !== primary)];
}
