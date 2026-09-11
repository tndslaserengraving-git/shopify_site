const KEYWORDS = [
  'zodiac tumbler',
  '20oz zodiac',
  'zodiac skinny',
  'laser engraved tumbler',
  'custom tumbler',
  'pet id tag',
  'pet tag',
  'business card',
  'round wooden sign',
  'round wood sign',
  'wooden earring',
  'wood earring',
  'wedding ring box',
  'ring box',
  'slate plaque',
  'wooden coaster',
  'wood coaster',
  'family coaster',
  'cedar wood sign',
  'cedar sign',
  'license plate',
  'custom plate',
'hat with custom leatherette patch',
'leatherette patch hat',
 'custom leatherette patch',];

export function isCustomizable(title: string): boolean {
  const lower = title.toLowerCase();
  return KEYWORDS.some((kw) => lower.includes(kw));
}
