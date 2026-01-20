import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CharacterOption, CHARACTER_OPTIONS } from '../constants/app';
import { getCharacter, saveCharacter } from '../utils/storage';

type CharacterContextValue = {
  character: CharacterOption | null;
  options: CharacterOption[];
  loadCharacter: () => Promise<void>;
  selectCharacter: (value: CharacterOption) => Promise<void>;
import { getCharacter, saveCharacter } from '../utils/storage';

const CHARACTER_OPTIONS = [
  'Dengeli & Düşünen',
  'Cool ama Kararsız',
  'Fazla İlgili',
  'Yeni Ayrılmış',
  'Net & Direkt'
];

type CharacterContextValue = {
  character: string | null;
  options: string[];
  loadCharacter: () => Promise<void>;
  selectCharacter: (value: string) => Promise<void>;
};

const CharacterContext = createContext<CharacterContextValue | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<CharacterOption | null>(null);
  const [character, setCharacter] = useState<string | null>(null);

  const loadCharacter = useCallback(async () => {
    const stored = await getCharacter();
    if (stored) {
      if (CHARACTER_OPTIONS.includes(stored as CharacterOption)) {
        setCharacter(stored as CharacterOption);
      }
    }
  }, []);

  const selectCharacter = useCallback(async (value: CharacterOption) => {
      setCharacter(stored);
    }
  }, []);

  const selectCharacter = useCallback(async (value: string) => {
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
