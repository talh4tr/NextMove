import Constants from 'expo-constants';
import { CharacterOption, ToneOption } from '../constants/app';
import { AnalysisResult, MessageSuggestion } from '../types/analysis';

type AnalyzePayload = {
  character: CharacterOption;
  conversation: string;
};

type SuggestPayload = {
  character: CharacterOption;
  tone: ToneOption;
  conversation: string;
};

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const request = async <T>(path: string, payload: Record<string, unknown>): Promise<T> => {
  if (!apiBaseUrl) {
    throw new Error('API base URL missing. Set EXPO_PUBLIC_API_BASE_URL.');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new ApiError('Sunucu yanıtı alınamadı.', response.status);
  }

  return response.json() as Promise<T>;
};

export const analyzeConversation = async (payload: AnalyzePayload) => {
  return request<AnalysisResult>('/analyze', payload);
};

export const suggestMessage = async (payload: SuggestPayload) => {
  return request<MessageSuggestion>('/suggest', payload);
};
