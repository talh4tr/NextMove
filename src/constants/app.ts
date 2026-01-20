export const CHARACTER_OPTIONS = [
  'Dengeli & Düşünen',
  'Cool ama Kararsız',
  'Fazla İlgili',
  'Yeni Ayrılmış',
  'Net & Direkt'
] as const;

export type CharacterOption = (typeof CHARACTER_OPTIONS)[number];

export const CHARACTER_DETAILS: Record<CharacterOption, { description: string; example: string }> = {
  'Dengeli & Düşünen': {
    description: 'Net ama sakin ilerler. Tempoyu dengede tutar.',
    example: '“Günün nasıl geçti, sakin bir akşamda konuşalım mı?”'
  },
  'Cool ama Kararsız': {
    description: 'Hafif mesafe koyar, netleşmeden sinyal verir.',
    example: '“Bugün yoğundu, sonra yazarım. Şimdi nasılsın?”'
  },
  'Fazla İlgili': {
    description: 'İlgi yüksek, bazen fazla görünür.',
    example: '“Gün boyu aklımdaydın, her şey yolunda mı?”'
  },
  'Yeni Ayrılmış': {
    description: 'Duygu karmaşası var, temkinli ve açık konuşur.',
    example: '“Biraz taze ayrıldım, acele etmeden ilerleyelim.”'
  },
  'Net & Direkt': {
    description: 'Kısa ve net yazar, hedefi bellidir.',
    example: '“Bu hafta kahve içelim. Perşembe müsün?”'
  }
};

export const TONE_OPTIONS = ['Dengeli', 'Daha Mesafeli', 'Daha Net'] as const;

export type ToneOption = (typeof TONE_OPTIONS)[number];
