import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useCharacter } from '../context/CharacterContext';
import { analyzeConversation } from '../services/aiClient';
import { AnalysisResult } from '../types/analysis';

type ConversationInputScreenProps = {
  onAnalysisReady: (analysis: AnalysisResult, conversation: string) => void;
};

const ConversationInputScreen: React.FC<ConversationInputScreenProps> = ({ onAnalysisReady }) => {
  const { character } = useCharacter();
  const [conversation, setConversation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!character || !conversation.trim()) {
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
      setError('Analiz sırasında bir sorun oluştu. Lütfen tekrar dene.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Konuşmayı yapıştır</Text>
      <TextInput
        style={styles.input}
        placeholder="Mesajları buraya yapıştır…"
        placeholderTextColor="#6D6D6D"
        value={conversation}
        onChangeText={setConversation}
        multiline
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator color="#E6FF4E" />
        ) : (
          <PrimaryButton label="Analiz Et" onPress={handleAnalyze} disabled={!conversation.trim()} />
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
  error: {
    marginTop: 12,
    color: '#FF8E8E'
  },
  footer: {
    marginTop: 'auto'
  }
});

export default ConversationInputScreen;
