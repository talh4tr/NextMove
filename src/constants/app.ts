export const STYLE_OPTIONS = ['Cool', 'Romantik', 'Komik', 'Ciddi'] as const;

export const DEFAULT_STYLE = 'Cool';

export type StyleOption = (typeof STYLE_OPTIONS)[number];
