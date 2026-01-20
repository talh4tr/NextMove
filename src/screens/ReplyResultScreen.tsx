import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import ScreenContainer from '../components/ScreenContainer';
import ToneButton from '../components/ToneButton';
import { DEFAULT_STYLE, STYLE_OPTIONS, StyleOption } from '../constants/app';
import { useStyle } from '../context/StyleContext';
import { generateReply } from '../services/aiClient';
import { logEvent } from '../services/analytics';
import {
  BadResponseError,
  NetworkOfflineError,
  RateLimitError,
  TimeoutError
} from '../services/errors';
import { ReplyResult } from '../types/reply';
import { loadRecentReplies, saveRecentReplies } from '../utils/storage';

type ReplyResultScreenProps = {
  result: ReplyResult;
  onRegenerate?: (result: ReplyResult) => void;
};

const ReplyResultScreen: React.FC<ReplyResultScreenProps> = ({ result, onRegenerate }) => {
  const { style, selectStyle } = useStyle();
  const [current, setCurrent] = useState<ReplyResult>(result);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(result.style || style || DEFAULT_STYLE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [includeShareText, setIncludeShareText] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const shareMessages = useMemo(
    () => [
      'Bunu NextMove yazdı. İndir, dene.',
      'NextMove ile dene, cevabı saniyede al 😄'
    ],
    []
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const replies = useMemo(
    () => [
      { label: 'En iyi cevap', text: current.result.bestReply, isBest: true },
      ...current.result.alternatives.map((text, index) => ({
        label: `Alternatif ${index + 1}`,
        text,
        isBest: false
      }))
    ],
    [current]
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const persistResult = useCallback(async (nextResult: ReplyResult) => {
    const stored = await loadRecentReplies();
    const filtered = stored.filter((item) => item.id !== nextResult.id);
    const next = [nextResult, ...filtered].slice(0, 10);
    await saveRecentReplies(next);
  }, []);

  const handleGenerate = useCallback(
    async (nextStyle: StyleOption) => {
      if (loading) {
        return;
      }
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setSelectedStyle(nextStyle);
      setLoading(true);
      setError(null);
      logEvent('generate_click', { source: 'result', style: nextStyle });
      if (nextStyle !== selectedStyle) {
        logEvent('style_change', { style: nextStyle });
      }
      try {
        await selectStyle(nextStyle);
        const generated = await generateReply({
          incomingMessage: current.message,
          goal: current.goal,
          style: nextStyle
        });
        if (requestId !== requestIdRef.current) {
          return;
        }
        const updated: ReplyResult = {
          ...current,
          style: nextStyle,
          generatedAt: Date.now(),
          result: generated
        };
        setCurrent(updated);
        await persistResult(updated);
        logEvent('generate_success', { style: nextStyle, source: 'result' });
        onRegenerate?.(updated);
      } catch (err) {
        const fallbackMessage = 'Cevap alınamadı. Lütfen tekrar dene.';
        if (requestId !== requestIdRef.current) {
          return;
        }
        if (err instanceof RateLimitError) {
          setError(err.message);
          return;
        }
        if (err instanceof TimeoutError) {
          setError('İstek zaman aşımına uğradı. Tekrar dene.');
          return;
        }
        if (err instanceof NetworkOfflineError) {
          setError('Bağlantı yok. İnterneti kontrol et.');
          return;
        }
        if (err instanceof BadResponseError) {
          setError(err.message || fallbackMessage);
          return;
        }
        setError(fallbackMessage);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [current, loading, onRegenerate, persistResult, selectStyle, selectedStyle]
  );

  const handleCopy = useCallback(
    async (text: string) => {
      await Clipboard.setStringAsync(text);
      try {
        await Haptics.selectionAsync();
      } catch {
        // ignore haptics failures
      }
      showToast('Kopyalandı');
      logEvent('copy_click', { style: current.style });
    },
    [current.style, showToast]
  );

  const handleShare = useCallback(
    async (text: string) => {
      const shareSuffix = shareMessages[Math.floor(Math.random() * shareMessages.length)];
      const shareText = includeShareText
        ? `${text}\n\n${shareSuffix}`
        : text;
      await Share.share({ message: shareText });
      logEvent('share_click', { style: current.style });
    },
    [current.style, includeShareText, shareMessages]
  );

  const handleStylePress = useCallback(
    (nextStyle: StyleOption) => {
      setSelectedStyle(nextStyle);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        handleGenerate(nextStyle);
      }, 800);
    },
    [handleGenerate]
  );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Önerilen cevaplar</Text>
        <Text style={styles.subtitle}>Tarz: {selectedStyle}</Text>
        {current.result.explanation ? (
          <Text style={styles.helperText}>{current.result.explanation}</Text>
        ) : null}
        {current.result.followUp ? (
          <View style={styles.followUp}>
            <Text style={styles.followUpLabel}>Sonraki adım</Text>
            <Text style={styles.followUpText}>{current.result.followUp}</Text>
          </View>
        ) : null}
        <Text style={styles.sectionLabel}>Tarz seç</Text>
        <View style={styles.toneRow}>
          {STYLE_OPTIONS.map((tone) => (
            <ToneButton
              key={tone}
              label={tone}
              selected={selectedStyle === tone}
              onPress={() => handleStylePress(tone)}
            />
          ))}
        </View>
        {loading ? <ActivityIndicator color="#E6FF4E" style={styles.loading} /> : null}
        {error ? (
          <View style={styles.errorRow}>
            <Text style={styles.error}>{error}</Text>
            <Pressable onPress={() => handleGenerate(selectedStyle)} disabled={loading}>
              <Text style={styles.retry}>Tekrar dene</Text>
            </Pressable>
          </View>
        ) : null}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Paylaşım metni ekle</Text>
          <Pressable
            style={[styles.toggle, includeShareText ? styles.toggleOn : styles.toggleOff]}
            onPress={() => setIncludeShareText((prev) => !prev)}
          >
            <View
              style={[
                styles.toggleHandle,
                includeShareText ? styles.toggleHandleOn : styles.toggleHandleOff
              ]}
            />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsRow}>
          {replies.map((item) => (
            <View key={item.label} style={styles.card}>
              <Text style={styles.cardLabel}>{item.isBest ? 'En iyi cevap' : item.label}</Text>
              <Text style={styles.cardText}>{item.text}</Text>
              <View style={styles.cardActions}>
                <Pressable
                  style={item.isBest ? styles.actionPrimary : null}
                  onPress={() => handleCopy(item.text)}
                >
                  <Text style={item.isBest ? styles.actionTextPrimary : styles.actionText}>
                    Kopyala
                  </Text>
                </Pressable>
                <Pressable onPress={() => handleShare(item.text)}>
                  <Text style={styles.actionText}>Paylaş</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
        <Pressable
          style={styles.regenerateButton}
          onPress={() => handleGenerate(selectedStyle)}
          disabled={loading}
        >
          <Text style={styles.regenerateText}>Yeniden üret</Text>
        </Pressable>
      </ScrollView>
      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
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
    marginTop: 6,
    color: '#E6FF4E',
    fontWeight: '600'
  },
  helperText: {
    marginTop: 10,
    color: '#BDBDBD',
    lineHeight: 20
  },
  sectionLabel: {
    marginTop: 16,
    color: '#E6FF4E',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 12
  },
  followUp: {
    marginTop: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    backgroundColor: '#111111'
  },
  followUpLabel: {
    color: '#E6FF4E',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase'
  },
  followUpText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22
  },
  toneRow: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  loading: {
    marginTop: 12
  },
  errorRow: {
    marginTop: 10,
    gap: 6
  },
  error: {
    color: '#FF8E8E'
  },
  retry: {
    color: '#E6FF4E',
    fontWeight: '600'
  },
  cardsRow: {
    marginTop: 16
  },
  card: {
    width: 260,
    marginRight: 12,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    backgroundColor: '#111111'
  },
  cardLabel: {
    color: '#E6FF4E',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  cardText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22
  },
  cardActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionText: {
    color: '#E6FF4E',
    fontWeight: '600'
  },
  actionPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#E6FF4E'
  },
  actionTextPrimary: {
    color: '#0B0B0B',
    fontWeight: '700'
  },
  regenerateButton: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    paddingVertical: 12,
    alignItems: 'center'
  },
  regenerateText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  toggleRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toggleLabel: {
    color: '#FFFFFF'
  },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3
  },
  toggleOn: {
    backgroundColor: '#E6FF4E'
  },
  toggleOff: {
    backgroundColor: '#2D2D2D'
  },
  toggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  toggleHandleOn: {
    backgroundColor: '#0B0B0B',
    alignSelf: 'flex-end'
  },
  toggleHandleOff: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start'
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2D2D2D',
    alignItems: 'center'
  },
  toastText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  scrollContent: {
    paddingBottom: 32
  }
});

export default ReplyResultScreen;
