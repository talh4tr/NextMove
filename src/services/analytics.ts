import AsyncStorage from '@react-native-async-storage/async-storage';

export type AnalyticsEventName =
  | 'generate_click'
  | 'generate_success'
  | 'copy_click'
  | 'share_click'
  | 'style_change';

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  payload?: Record<string, string | number | boolean | null>;
  createdAt: number;
};

const ANALYTICS_KEY = 'nextmove.analytics';
const MAX_EVENTS = 200;

export const logEvent = async (name: AnalyticsEventName, payload?: AnalyticsEvent['payload']) => {
  const event: AnalyticsEvent = {
    name,
    payload,
    createdAt: Date.now()
  };

  try {
    const raw = await AsyncStorage.getItem(ANALYTICS_KEY);
    const parsed = raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
    const next = Array.isArray(parsed) ? [...parsed, event].slice(-MAX_EVENTS) : [event];
    await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(next));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Analytics kaydedilemedi:', error);
  }
};
