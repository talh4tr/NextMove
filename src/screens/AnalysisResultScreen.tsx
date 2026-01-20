import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ToneButton from '../components/ToneButton';
import { TONE_OPTIONS, ToneOption } from '../constants/app';
import { useCharacter } from '../context/CharacterContext';
import { suggestMessage } from '../services/aiClient';
import { AnalysisResult, MessageSuggestion } from '../types/analysis';

type AnalysisResultScreenProps = {
  analysis: AnalysisResult;
  conversation: string;
};

const AnalysisResultScreen: React.FC<AnalysisResultScreenProps> = ({ analysis, conversation }) => {
  const { character } = useCharacter();
  const [selectedTone, setSelectedTone] = useState<ToneOption>('Dengeli');
  const [suggestion, setSuggestion] = useState<MessageSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestion = useCallback(
    async (tone: ToneOption) => {
      if (!character) {
        return;
      }

      setSelectedTone(tone);
      setLoading(true);
      setError(null);

      try {
        const result = await suggestMessage({
          character,
          tone,
          conversation
        });
        setSuggestion(result);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Mesaj önerisi başarısız:', err);
        setError('Öneri alınamadı. Lütfen tekrar dene.');
      } finally {
        setLoading(false);
      }
    },
    [character, conversation]
  );

  useEffect(() => {
    fetchSuggestion('Dengeli');
  }, [fetchSuggestion]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Analiz Sonucu</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Genel Durum</Text>
        <Text style={styles.sectionText}>İlgi: %{analysis.interestScore}</Text>
        <Text style={styles.sectionMeta}>{analysis.trend}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Tespit</Text>
        <Text style={styles.sectionText}>{analysis.detection}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Öneri</Text>
        <Text style={styles.sectionText}>Ne zaman yazmalı: {analysis.recommendation.timing}</Text>
        <Text style={styles.sectionText}>Nasıl ilerlemeli: {analysis.recommendation.nextStep}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bir sonraki hamle</Text>
        <View style={styles.toneRow}>
          {TONE_OPTIONS.map((tone) => (
            <ToneButton
              key={tone}
              label={tone}
              selected={selectedTone === tone}
              onPress={() => fetchSuggestion(tone)}
            />
          ))}
        </View>
        {loading ? <ActivityIndicator color="#E6FF4E" /> : null}
        {error ? (
          <View style={styles.errorRow}>
            <Text style={styles.error}>{error}</Text>
            <Pressable onPress={() => fetchSuggestion(selectedTone)} disabled={loading}>
              <Text style={styles.retry}>Tekrar dene</Text>
            </Pressable>
          </View>
        ) : null}
        {suggestion ? <Text style={styles.suggestion}>{suggestion.message}</Text> : null}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  card: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#111111',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2D2D2D'
  },
  sectionTitle: {
    color: '#E6FF4E',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase'
  },
  sectionText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22
  },
  sectionMeta: {
    marginTop: 6,
    color: '#BDBDBD'
  },
  toneRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  errorRow: {
    marginTop: 10,
    gap: 6
  },
  suggestion: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22
  },
  error: {
    color: '#FF8E8E'
  },
  retry: {
    color: '#E6FF4E',
    fontWeight: '600'
  }
});

export default AnalysisResultScreen;
