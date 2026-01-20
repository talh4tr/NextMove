export const STYLE_OPTIONS = [
  'Cool',
  'Komik',
  'Romantik',
  'Agresif',
  'Sakin',
  'Zekice'
] as const;

export const DEFAULT_STYLE = 'Cool';

export type StyleOption = (typeof STYLE_OPTIONS)[number];
