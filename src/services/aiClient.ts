import Constants from 'expo-constants';
import { AnalysisResult, MessageSuggestion } from '../types/analysis';

type AnalyzePayload = {
  character: string;
  conversation: string;
};

type SuggestPayload = {
  character: string;
  tone: MessageSuggestion['tone'];
  conversation: string;
};

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

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
    throw new Error('Sunucu yanıtı alınamadı.');
  }

  return response.json() as Promise<T>;
};

export const analyzeConversation = async (payload: AnalyzePayload) => {
  return request<AnalysisResult>('/analyze', payload);
};

export const suggestMessage = async (payload: SuggestPayload) => {
  return request<MessageSuggestion>('/suggest', payload);
};
