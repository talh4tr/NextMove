import Constants from 'expo-constants';
import { StyleOption } from '../constants/app';
import { GenerateReplyRequest, GenerateReplyResponse } from '../types/api';
import {
  BadResponseError,
  NetworkOfflineError,
  RateLimitError,
  TimeoutError
} from './errors';
import { parseGenerateReplyResponse } from './responseParser';

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

const request = async <T>(path: string, payload: Record<string, unknown>): Promise<T> => {
  if (!apiBaseUrl) {
    throw new BadResponseError('API base URL eksik. EXPO_PUBLIC_API_BASE_URL ayarla.');
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
      throw new RateLimitError('Çok fazla istek. 30 saniye sonra tekrar dene.', 30000);
    }

    if (!response.ok) {
      throw new BadResponseError('Sunucu yanıtı alınamadı.');
    }

    return (await response.json()) as T;
  } catch (error) {
    if (
      error instanceof RateLimitError ||
      error instanceof TimeoutError ||
      error instanceof NetworkOfflineError ||
      error instanceof BadResponseError
    ) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError();
    }
    if (error instanceof TypeError) {
      throw new NetworkOfflineError();
    }
    throw new BadResponseError('Beklenmeyen bir hata oluştu.');
  } finally {
    clearTimeout(timeoutId);
  }
};

type GeneratePayload = {
  incomingMessage: string;
  goal?: string;
  style: StyleOption;
};

export const generateReply = async (payload: GeneratePayload): Promise<GenerateReplyResponse> => {
  const requestPayload: GenerateReplyRequest = {
    incomingMessage: payload.incomingMessage,
    goal: payload.goal,
    style: payload.style,
    locale: 'tr-TR',
    appVersion: Constants.expoConfig?.version
  };

  const response = await request<unknown>('/generate', requestPayload);
  const parsed = parseGenerateReplyResponse(response);
  if (!parsed.ok) {
    throw new BadResponseError(parsed.message);
  }
  return parsed.value;
};
