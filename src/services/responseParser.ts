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

const MAX_REPLY_LENGTH = 260;
const MIN_TRIM_POSITION = 160;

const limitLength = (text: string) => {
  if (text.length <= MAX_REPLY_LENGTH) {
    return text;
  }
  const trimmed = text.slice(0, MAX_REPLY_LENGTH);
  const lastSpace = trimmed.lastIndexOf(' ');
  if (lastSpace > MIN_TRIM_POSITION) {
    return `${trimmed.slice(0, lastSpace).trim()}…`;
  }
  return `${trimmed.trim()}…`;
};

const normalizeReply = (text: unknown) => {
  const trimmed = normalizeString(text);
  if (!trimmed) {
    return '';
  }
  return limitLength(trimmed);
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
