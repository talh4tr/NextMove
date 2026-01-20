import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { DEFAULT_STYLE } from '../constants/app';
import { useStyle } from '../context/StyleContext';
import { ApiError, generateReply } from '../services/aiClient';
import { logEvent } from '../services/analytics';
import { ReplyResult } from '../types/reply';
import { loadRecentReplies, saveRecentReplies } from '../utils/storage';

type ConversationInputScreenProps = {
  onReplyReady: (result: ReplyResult) => void;
};

const ConversationInputScreen: React.FC<ConversationInputScreenProps> = ({ onReplyReady }) => {
  const { style } = useStyle();
  const [message, setMessage] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [recentReplies, setRecentReplies] = useState<ReplyResult[]>([]);
  const [retryUntil, setRetryUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    loadRecentReplies()
      .then(setRecentReplies)
      .catch(() => setRecentReplies([]));
  }, []);

  useEffect(() => {
    if (!retryUntil) {
      return undefined;
    }
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [retryUntil]);

  const trimmedMessage = useMemo(() => message.trim(), [message]);
  const trimmedGoal = useMemo(() => goal.trim(), [goal]);
  const wordCount = useMemo(
    () => (trimmedMessage ? trimmedMessage.split(/\s+/).filter(Boolean).length : 0),
    [trimmedMessage]
  );
  const isEmpty = useMemo(() => !trimmedMessage, [trimmedMessage]);
  const isTooShort = useMemo(() => wordCount > 0 && wordCount < 2, [wordCount]);
  const showValidation = touched && (isEmpty || isTooShort);
  const isRateLimited = retryUntil ? now < retryUntil : false;
  const retryInSeconds = retryUntil ? Math.max(0, Math.ceil((retryUntil - now) / 1000)) : 0;

  const handleAnalyze = async () => {
    if (isEmpty || isTooShort || isRateLimited) {
      setTouched(true);
      return;
    }

    setLoading(true);
    setError(null);
    setRetryUntil(null);
    logEvent('generate_click', { source: 'input' });

    try {
      const result = await generateReply({
        message: trimmedMessage,
        goal: trimmedGoal || undefined,
        style: style || DEFAULT_STYLE
      });

      const newResult: ReplyResult = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        message: trimmedMessage,
        goal: trimmedGoal || undefined,
        style: style || DEFAULT_STYLE,
        generatedAt: Date.now(),
        result
      };

      const nextRecent = [newResult, ...recentReplies].slice(0, 10);
      setRecentReplies(nextRecent);
      await saveRecentReplies(nextRecent);
      logEvent('generate_success', { style: newResult.style });
      onReplyReady(newResult);
    } catch (err) {
      const fallbackMessage = 'Cevap üretilemedi. Lütfen tekrar dene.';
      if (err instanceof ApiError) {
        if (err.kind === 'rate_limit') {
          setRetryUntil(Date.now() + (err.retryAfterMs ?? 30000));
          setError(err.message);
        } else {
          setError(err.message || fallbackMessage);
        }
      } else {
        setError(fallbackMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Tek ekran, tek iş</Text>
        <Text style={styles.subtitle}>Karşıdan gelen mesajı yapıştır, hemen cevap al.</Text>
        <Text style={styles.label}>Karşıdan gelen mesaj</Text>
        <TextInput
          style={[styles.input, showValidation ? styles.inputError : null]}
          placeholder="Yaz ne yazayım ki"
          placeholderTextColor="#6D6D6D"
          value={message}
          onChangeText={(value) => {
            setMessage(value);
            if (error) {
              setError(null);
            }
          }}
          onBlur={() => setTouched(true)}
          multiline
        />
        {showValidation ? (
          <Text style={styles.helper}>
            {isEmpty ? 'Mesajı boş bırakma.' : 'En az 2 kelime yazmalısın.'}
          </Text>
        ) : null}
        <Text style={styles.label}>Ben ne istiyorum? (opsiyonel)</Text>
        <TextInput
          style={styles.goalInput}
          placeholder="Amaç: buluşma, numara, flört"
          placeholderTextColor="#6D6D6D"
          value={goal}
          onChangeText={setGoal}
          multiline
        />
        {error ? (
          <View style={styles.errorRow}>
            <Text style={styles.error}>{error}</Text>
            <Pressable onPress={handleAnalyze} disabled={loading || isRateLimited}>
              <Text style={styles.retry}>
                {isRateLimited ? `Bekle (${retryInSeconds}s)` : 'Tekrar dene'}
              </Text>
            </Pressable>
          </View>
        ) : null}
        <View style={styles.footer}>
          {loading ? (
            <ActivityIndicator color="#E6FF4E" />
          ) : (
            <PrimaryButton
              label="Cevap Üret"
              onPress={handleAnalyze}
              disabled={isEmpty || isTooShort || isRateLimited}
            />
          )}
        </View>
        {recentReplies.length > 0 ? (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Son cevaplarım</Text>
            {recentReplies.map((item) => (
              <Pressable
                key={item.id}
                style={styles.recentCard}
                onPress={() => onReplyReady(item)}
              >
                <Text style={styles.recentLabel}>{item.style}</Text>
                <Text style={styles.recentText} numberOfLines={2}>
                  {item.message}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  subtitle: {
    marginTop: 8,
    color: '#BDBDBD',
    lineHeight: 20
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24
  },
  label: {
    marginTop: 18,
    color: '#E6FF4E',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  input: {
    marginTop: 10,
    minHeight: 180,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    backgroundColor: '#111111',
    color: '#FFFFFF',
    padding: 16,
    textAlignVertical: 'top'
  },
  goalInput: {
    marginTop: 10,
    minHeight: 90,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    backgroundColor: '#111111',
    color: '#FFFFFF',
    padding: 16,
    textAlignVertical: 'top'
  },
  inputError: {
    borderColor: '#FF8E8E'
  },
  helper: {
    marginTop: 10,
    color: '#BDBDBD'
  },
  errorRow: {
    marginTop: 12,
    gap: 6
  },
  error: {
    color: '#FF8E8E'
  },
  retry: {
    color: '#E6FF4E',
    fontWeight: '600'
  },
  footer: {
    marginTop: 16
  },
  recentSection: {
    marginTop: 24,
    gap: 12
  },
  recentTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  recentCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    backgroundColor: '#111111',
    padding: 14
  },
  recentLabel: {
    color: '#E6FF4E',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  recentText: {
    marginTop: 8,
    color: '#FFFFFF',
    lineHeight: 20
  }
});

export default ConversationInputScreen;
