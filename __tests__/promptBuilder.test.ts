import { buildReplyPrompt } from '../src/services/promptBuilder';

describe('buildReplyPrompt', () => {
  it('builds a prompt with style and goal', () => {
    const result = buildReplyPrompt({
      message: 'Selam, naber?',
      goal: 'Buluşmaya çekmek',
      style: 'Cool'
    });

    expect(result.system).toContain('flört asistanısın');
    expect(result.user).toContain('Tarz: Cool');
    expect(result.user).toContain('Kısa hedef: Buluşmaya çekmek');
    expect(result.user).toContain('Selam, naber?');
  });
});
