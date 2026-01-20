import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import ToneButton from '../components/ToneButton';
import { CharacterOption, CHARACTER_DETAILS } from '../constants/app';
import { useCharacter } from '../context/CharacterContext';

type OnboardingScreenProps = {
  onDone: () => void;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onDone }) => {
  const { options, selectCharacter } = useCharacter();
  const [selected, setSelected] = useState<CharacterOption | null>(null);

  const handleSelect = (value: CharacterOption) => {
    setSelected(value);
  };

  const handleContinue = async () => {
    if (!selected) {
      return;
    }
    await selectCharacter(selected);
    onDone();
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Kendini seç</Text>
      <Text style={styles.subtitle}>
        Flörtte herkes aynı ilerlemez. Tarzını seç, analiz buna göre şekillensin.
      </Text>
      <View style={styles.optionList}>
        {options.map((option) => (
          <View key={option} style={styles.optionCard}>
            <ToneButton
              label={option}
              selected={selected === option}
              onPress={() => handleSelect(option)}
            />
            <Text style={styles.optionDescription}>{CHARACTER_DETAILS[option].description}</Text>
            <Text style={styles.optionExample}>{CHARACTER_DETAILS[option].example}</Text>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Devam Et" onPress={handleContinue} disabled={!selected} />
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
  optionList: {
    marginTop: 24,
    gap: 12
  },
  optionCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#232323',
    backgroundColor: '#101010',
    gap: 6
  },
  optionDescription: {
    color: '#CFCFCF',
    fontSize: 13
  },
  optionExample: {
    color: '#7E7E7E',
    fontSize: 12
  },
  footer: {
    marginTop: 'auto'
  }
});

export default OnboardingScreen;
