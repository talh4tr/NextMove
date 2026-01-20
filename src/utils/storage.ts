import AsyncStorage from '@react-native-async-storage/async-storage';

const CHARACTER_KEY = 'nextmove.character';

export const saveCharacter = async (character: string) => {
  await AsyncStorage.setItem(CHARACTER_KEY, character);
};

export const getCharacter = async () => {
  return AsyncStorage.getItem(CHARACTER_KEY);
};

export const clearCharacter = async () => {
  await AsyncStorage.removeItem(CHARACTER_KEY);
};
