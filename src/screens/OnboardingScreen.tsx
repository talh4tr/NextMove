import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';

type OnboardingScreenProps = {
  onDone: () => void;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onDone }) => {
  return (
    <ScreenContainer>
      <Text style={styles.title}>NextMove</Text>
      <Text style={styles.subtitle}>Yapıştır, cevabı kopyala, gönder.</Text>
      <View style={styles.steps}>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Karşıdan gelen mesajı yapıştır.</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Amacını kısaca yaz (opsiyonel).</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>En iyi cevabı al, kopyala, paylaş.</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Başla" onPress={onDone} />
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
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    color: '#BDBDBD',
    lineHeight: 22
  },
  steps: {
    marginTop: 24,
    gap: 16
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    backgroundColor: '#111111'
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E6FF4E',
    color: '#0B0B0B',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '700'
  },
  stepText: {
    color: '#FFFFFF',
    flex: 1
  },
  footer: {
    marginTop: 'auto'
  }
});

export default OnboardingScreen;
