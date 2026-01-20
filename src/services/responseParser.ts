import { GenerateReplyResponse } from '../types/api';

type ParseSuccess = {
  ok: true;
  value: GenerateReplyResponse;
};

type ParseFailure = {
  ok: false;
  message: string;
};

export type ParseResult = ParseSuccess | ParseFailure;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const toSentences = (text: string) => {
  const matches = text.match(/[^.!?]+[.!?]?/g) || [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
};

const limitToTwoSentences = (text: string) => {
  const sentences = toSentences(text);
  const unique = sentences.filter(
    (sentence, index) =>
      sentences.findIndex((item) => item.toLowerCase() === sentence.toLowerCase()) === index
  );
  return unique.slice(0, 2).join(' ');
};

const normalizeReply = (text: unknown) => {
  const trimmed = normalizeString(text);
  if (!trimmed) {
    return '';
  }
  return limitToTwoSentences(trimmed);
};

export const parseGenerateReplyResponse = (payload: unknown): ParseResult => {
  if (!isRecord(payload)) {
    return { ok: false, message: 'Yanıt formatı geçersiz.' };
  }

  const bestReply = normalizeReply(payload.bestReply);
  if (!bestReply) {
    return { ok: false, message: 'Sunucudan boş cevap geldi.' };
  }

  const alternativesRaw = Array.isArray(payload.alternatives) ? payload.alternatives : [];
  const alternatives = alternativesRaw
    .map((item) => normalizeReply(item))
    .filter((item) => item.length > 0);

  while (alternatives.length < 3) {
    alternatives.push(bestReply);
  }

  const explanation = normalizeString(payload.explanation) || undefined;
  const followUp = normalizeString(payload.followUp) || undefined;

  return {
    ok: true,
    value: {
      bestReply,
      alternatives: alternatives.slice(0, 3),
      explanation,
      followUp
    }
  };
};
