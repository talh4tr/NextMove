import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CharacterOption, CHARACTER_OPTIONS } from '../constants/app';
import { clearCharacter, getCharacter, saveCharacter } from '../utils/storage';

type CharacterContextValue = {
  character: CharacterOption | null;
  options: CharacterOption[];
  loadCharacter: () => Promise<void>;
  selectCharacter: (value: CharacterOption) => Promise<void>;
};

const CharacterContext = createContext<CharacterContextValue | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<CharacterOption | null>(null);

  const loadCharacter = useCallback(async () => {
    try {
      const stored = await getCharacter();
      if (stored && CHARACTER_OPTIONS.includes(stored as CharacterOption)) {
        setCharacter(stored as CharacterOption);
        return;
      }
      if (stored) {
        await clearCharacter();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Karakter yüklenemedi:', error);
    }
  }, []);

  const selectCharacter = useCallback(async (value: CharacterOption) => {
    setCharacter(value);
    await saveCharacter(value);
  }, []);

  const value = useMemo(
    () => ({
      character,
      options: CHARACTER_OPTIONS,
      loadCharacter,
      selectCharacter
    }),
    [character, loadCharacter, selectCharacter]
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within CharacterProvider');
  }
  return context;
};
