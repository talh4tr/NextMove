import { GenerateReplyResult } from '../types/reply';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const parseGenerateReplyResponse = (payload: unknown): GenerateReplyResult => {
  if (!isRecord(payload)) {
    throw new Error('Yanıt formatı geçersiz.');
  }

  const bestReply = isNonEmptyString(payload.bestReply) ? payload.bestReply.trim() : '';
  const explanation = isNonEmptyString(payload.explanation) ? payload.explanation.trim() : '';
  const followUp = isNonEmptyString(payload.followUp) ? payload.followUp.trim() : null;

  const alternativesRaw = Array.isArray(payload.alternatives) ? payload.alternatives : [];
  const alternatives = alternativesRaw.filter(isNonEmptyString).map((item) => item.trim());

  if (!bestReply || !explanation) {
    throw new Error('Yanıt eksik alanlar içeriyor.');
  }

  while (alternatives.length < 3) {
    alternatives.push(bestReply);
  }

  return {
    bestReply,
    alternatives: alternatives.slice(0, 3),
    explanation,
    followUp
  };
};
