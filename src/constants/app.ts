export const CHARACTER_OPTIONS = [
  'Dengeli & Düşünen',
  'Cool ama Kararsız',
  'Fazla İlgili',
  'Yeni Ayrılmış',
  'Net & Direkt'
] as const;

export type CharacterOption = (typeof CHARACTER_OPTIONS)[number];

export const TONE_OPTIONS = ['Dengeli', 'Daha Mesafeli', 'Daha Net'] as const;

export type ToneOption = (typeof TONE_OPTIONS)[number];
