import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type ToneButtonProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

const ToneButton: React.FC<ToneButtonProps> = ({ label, selected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.default,
        pressed ? styles.pressed : null
      ]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textDefault]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1
  },
  default: {
    borderColor: '#2D2D2D',
    backgroundColor: '#141414'
  },
  selected: {
    borderColor: '#E6FF4E',
    backgroundColor: '#1E1E1E'
  },
  pressed: {
    opacity: 0.85
  },
  text: {
    fontSize: 14,
    fontWeight: '600'
  },
  textDefault: {
    color: '#E0E0E0'
  },
  textSelected: {
    color: '#E6FF4E'
  }
});

export default ToneButton;
