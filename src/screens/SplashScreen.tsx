import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';

type SplashScreenProps = {
  onContinue?: () => void;
  isLoading?: boolean;
  autoContinue?: boolean;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue, isLoading, autoContinue }) => {
  useEffect(() => {
    if (autoContinue && onContinue) {
      const timer = setTimeout(() => {
        onContinue();
      }, 900);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [autoContinue, onContinue]);

  return (
    <ScreenContainer>
      <View style={styles.spacer} />
      <Text style={styles.title}>NextMove AI</Text>
      <Text style={styles.subtitle}>Bir sonraki hamleni doğru yap.</Text>
      <View style={styles.spacer} />
      {isLoading ? <ActivityIndicator color="#E6FF4E" /> : null}
      {!autoContinue && onContinue ? <PrimaryButton label="Başla" onPress={onContinue} /> : null}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  spacer: {
    flex: 1
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#BDBDBD',
    textAlign: 'center'
  }
});

export default SplashScreen;
