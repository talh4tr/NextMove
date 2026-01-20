import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import ToneButton from '../components/ToneButton';
import { useCharacter } from '../context/CharacterContext';

type OnboardingScreenProps = {
  onDone: () => void;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onDone }) => {
  const { options, selectCharacter } = useCharacter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
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
          <ToneButton
            key={option}
            label={option}
            selected={selected === option}
            onPress={() => handleSelect(option)}
          />
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
  footer: {
    marginTop: 'auto'
  }
});

export default OnboardingScreen;
