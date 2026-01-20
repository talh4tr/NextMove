import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

  onContinue: () => void;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue }) => {
  return (
    <ScreenContainer>
      <View style={styles.spacer} />
      <Text style={styles.title}>NextMove AI</Text>
      <Text style={styles.subtitle}>Bir sonraki hamleni doğru yap.</Text>
      <View style={styles.spacer} />
      {isLoading ? <ActivityIndicator color="#E6FF4E" /> : null}
      {!autoContinue && onContinue ? <PrimaryButton label="Başla" onPress={onContinue} /> : null}
      <PrimaryButton label="Başla" onPress={onContinue} />
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
