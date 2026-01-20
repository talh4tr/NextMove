import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReplyResult } from '../types/reply';

const STYLE_KEY = 'nextmove.style';
const ONBOARDING_KEY = 'nextmove.onboarding';
const RECENT_REPLIES_KEY = 'nextmove.recent_replies';

export const saveStyle = async (style: string) => {
  await AsyncStorage.setItem(STYLE_KEY, style);
};

export const getStyle = async () => {
  return AsyncStorage.getItem(STYLE_KEY);
};

export const clearStyle = async () => {
  await AsyncStorage.removeItem(STYLE_KEY);
};

export const setOnboardingSeen = async () => {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
};

export const getOnboardingSeen = async () => {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === 'true';
};

export const loadRecentReplies = async (): Promise<ReplyResult[]> => {
  const raw = await AsyncStorage.getItem(RECENT_REPLIES_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as ReplyResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveRecentReplies = async (replies: ReplyResult[]) => {
  await AsyncStorage.setItem(RECENT_REPLIES_KEY, JSON.stringify(replies));
};
