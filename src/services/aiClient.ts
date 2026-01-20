import Constants from 'expo-constants';
import { StyleOption } from '../constants/app';
import { buildReplyPrompt } from './promptBuilder';
import { parseGenerateReplyResponse } from './responseParser';
import { GenerateReplyResult } from '../types/reply';

type GeneratePayload = {
  message: string;
  goal?: string;
  style: StyleOption;
};

export type ApiErrorKind = 'rate_limit' | 'offline' | 'timeout' | 'server';

export class ApiError extends Error {
  kind: ApiErrorKind;
  retryAfterMs?: number;

  constructor(kind: ApiErrorKind, message: string, retryAfterMs?: number) {
    super(message);
    this.kind = kind;
    this.retryAfterMs = retryAfterMs;
  }
}

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

const request = async <T>(path: string, payload: Record<string, unknown>): Promise<T> => {
  if (!apiBaseUrl) {
    throw new ApiError('server', 'API base URL eksik. EXPO_PUBLIC_API_BASE_URL ayarla.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (response.status === 429) {
      throw new ApiError('rate_limit', 'Çok fazla istek. 30 saniye sonra tekrar dene.', 30000);
    }

    if (!response.ok) {
      throw new ApiError('server', 'Sunucu yanıtı alınamadı.');
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('timeout', 'İstek zaman aşımına uğradı.');
    }
    if (error instanceof TypeError) {
      throw new ApiError('offline', 'Bağlantı yok. İnterneti kontrol et.');
    }
    throw new ApiError('server', 'Beklenmeyen bir hata oluştu.');
  } finally {
    clearTimeout(timeoutId);
  }
};

export const generateReply = async (payload: GeneratePayload): Promise<GenerateReplyResult> => {
  const prompt = buildReplyPrompt(payload);
  const response = await request<unknown>('/generate', {
    message: payload.message,
    goal: payload.goal,
    style: payload.style,
    prompt
  });
  return parseGenerateReplyResponse(response);
};
