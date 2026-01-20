import { buildReplyPrompt } from '../src/services/promptBuilder';

describe('buildReplyPrompt', () => {
  it('builds a prompt with style and goal', () => {
    const result = buildReplyPrompt({
      incomingMessage: 'Selam, naber?',
      goal: 'Buluşmaya çekmek',
      style: 'Cool'
    });

    expect(result.system).toContain('flört asistanısın');
    expect(result.user).toContain('Tarz: Cool');
    expect(result.user).toContain('Kısa hedef: Buluşmaya çekmek');
    expect(result.user).toContain('Selam, naber?');
  });

  it('changes prompt when style and goal change', () => {
    const cool = buildReplyPrompt({
      incomingMessage: 'Naber?',
      goal: 'Numara almak',
      style: 'Cool'
    });
    const funny = buildReplyPrompt({
      incomingMessage: 'Naber?',
      goal: 'Numara almak',
      style: 'Komik'
    });

    expect(cool.user).toContain('Tarz: Cool');
    expect(funny.user).toContain('Tarz: Komik');
  });
});
