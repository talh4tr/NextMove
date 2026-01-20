import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useCharacter } from '../context/CharacterContext';
import { ApiError, analyzeConversation } from '../services/aiClient';
import { AnalysisResult } from '../types/analysis';

type ConversationInputScreenProps = {
  onAnalysisReady: (analysis: AnalysisResult, conversation: string) => void;
};

const ConversationInputScreen: React.FC<ConversationInputScreenProps> = ({ onAnalysisReady }) => {
  const { character } = useCharacter();
  const [conversation, setConversation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);

  const isEmpty = useMemo(() => !conversation.trim(), [conversation]);
  const showValidation = touched && isEmpty;
  const progressSteps = ['Konuşma okunuyor…', 'İlgi analizi yapılıyor…', 'Öneriler hazırlanıyor…'];

  useEffect(() => {
    if (!loading) {
      setProgressIndex(0);
      return undefined;
    }

    const timer = setInterval(() => {
      setProgressIndex((prev) => (prev + 1) % progressSteps.length);
    }, 1200);

    return () => clearInterval(timer);
  }, [loading, progressSteps.length]);

  const resolveErrorMessage = (err: unknown) => {
    if (err instanceof TypeError) {
      return 'İnternet bağlantısı yok gibi görünüyor. Bağlantını kontrol et.';
    }
    if (err instanceof ApiError) {
      if (err.status >= 500) {
        return 'Sunucu şu an yoğun. Biraz sonra tekrar dene.';
      }
      return 'İstek işlenemedi. Konuşmayı kontrol edip tekrar dene.';
    }
    return 'Analiz sırasında bir sorun oluştu. Lütfen tekrar dene.';
  };

  const handleAnalyze = async () => {
    if (!character || isEmpty) {
      setTouched(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeConversation({
        character,
        conversation: conversation.trim()
      });
      onAnalysisReady(result, conversation.trim());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Analiz isteği başarısız:', err);
      setError(resolveErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Konuşmayı yapıştır</Text>
      <Text style={styles.privacy}>
        Bu içerik cihazında kalır. Analiz için yalnızca bu konuşma backend’e gönderilir. Karakter
        seçimin lokal saklanır.
      </Text>
      <TextInput
        style={[styles.input, showValidation ? styles.inputError : null]}
        placeholder="Mesajları buraya yapıştır…"
        placeholderTextColor="#6D6D6D"
        value={conversation}
        onChangeText={setConversation}
        onBlur={() => setTouched(true)}
        multiline
      />
      {showValidation ? (
        <Text style={styles.helper}>Analiz için bir konuşma yapıştırmalısın.</Text>
      ) : null}
      {error ? (
        <View style={styles.errorRow}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={handleAnalyze} disabled={loading}>
            <Text style={styles.retry}>Tekrar dene</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.footer}>
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#E6FF4E" />
            <Text style={styles.loadingText}>{progressSteps[progressIndex]}</Text>
          </View>
        ) : (
          <PrimaryButton label="Analiz Et" onPress={handleAnalyze} disabled={isEmpty} />
        )}
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
  privacy: {
    marginTop: 10,
    fontSize: 12,
    color: '#8B8B8B',
    lineHeight: 18
  },
  input: {
    marginTop: 16,
    height: 260,
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
    marginTop: 'auto'
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  loadingText: {
    color: '#BDBDBD',
    fontSize: 14
  }
});

export default ConversationInputScreen;
