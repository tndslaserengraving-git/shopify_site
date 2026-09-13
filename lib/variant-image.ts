import type { ShopifyVariant } from './shopify';

// Finds a representative photo for a given option name/value pair by
// scanning all variants and returning the first one that has both a
// matching option and its own image assigned. This lets a photo be
// assigned to just ONE variant (e.g. one color, or one patch) and be
// reused everywhere that value appears, instead of requiring every
// single color+patch combination to have its own separate image.
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
