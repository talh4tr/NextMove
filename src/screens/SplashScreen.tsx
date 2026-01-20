import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';

type SplashScreenProps = {
  onContinue: () => void;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue }) => {
  return (
    <ScreenContainer>
      <View style={styles.spacer} />
      <Text style={styles.title}>NextMove AI</Text>
      <Text style={styles.subtitle}>Bir sonraki hamleni doğru yap.</Text>
      <View style={styles.spacer} />
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
