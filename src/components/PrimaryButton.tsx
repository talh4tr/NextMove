import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onPress, disabled }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null
      ]}
      disabled={disabled}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E6FF4E',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center'
  },
  pressed: {
    opacity: 0.85
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0B0B'
  }
});

export default PrimaryButton;
