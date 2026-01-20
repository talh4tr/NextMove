import { parseGenerateReplyResponse } from '../src/services/responseParser';

describe('parseGenerateReplyResponse', () => {
  it('normalizes alternatives to three items', () => {
    const result = parseGenerateReplyResponse({
      bestReply: 'Tamamdır.',
      alternatives: ['Olur'],
      explanation: 'Kısa ve net.',
      followUp: 'Uygun olunca haber ver.'
    });

    expect(result.bestReply).toBe('Tamamdır.');
    expect(result.alternatives).toHaveLength(3);
  });

  it('throws on invalid payload', () => {
    expect(() => parseGenerateReplyResponse({ alternatives: [] })).toThrow('Yanıt eksik');
  });
});
