import { parseGenerateReplyResponse } from '../src/services/responseParser';

describe('parseGenerateReplyResponse', () => {
  it('normalizes alternatives to three items', () => {
    const result = parseGenerateReplyResponse({
      bestReply: 'Tamamdır.',
      alternatives: ['Olur'],
      explanation: 'Kısa ve net.',
      followUp: 'Uygun olunca haber ver.'
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.bestReply).toBe('Tamamdır.');
      expect(result.value.alternatives).toHaveLength(3);
    }
  });

  it('truncates alternatives when too many', () => {
    const result = parseGenerateReplyResponse({
      bestReply: 'Harika.',
      alternatives: ['A', 'B', 'C', 'D'],
      explanation: 'Test.'
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.alternatives).toHaveLength(3);
    }
  });

  it('handles missing alternatives', () => {
    const result = parseGenerateReplyResponse({
      bestReply: 'Tamam.',
      alternatives: [],
      explanation: 'Test.'
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.alternatives).toHaveLength(3);
    }
  });

  it('returns error when bestReply is empty', () => {
    const result = parseGenerateReplyResponse({
      bestReply: '   ',
      alternatives: ['a'],
      explanation: 'Test.'
    });

    expect(result.ok).toBe(false);
  });

  it('returns error on invalid types', () => {
    const result = parseGenerateReplyResponse({
      bestReply: 12,
      alternatives: [null],
      explanation: null
    });

    expect(result.ok).toBe(false);
  });
});
