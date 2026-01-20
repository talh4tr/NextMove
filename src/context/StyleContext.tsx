import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DEFAULT_STYLE, StyleOption, STYLE_OPTIONS } from '../constants/app';
import { clearStyle, getStyle, saveStyle } from '../utils/storage';

type StyleContextValue = {
  style: StyleOption;
  options: StyleOption[];
  loadStyle: () => Promise<void>;
  selectStyle: (value: StyleOption) => Promise<void>;
};

const StyleContext = createContext<StyleContextValue | undefined>(undefined);

export const StyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [style, setStyle] = useState<StyleOption>(DEFAULT_STYLE);

  const loadStyle = useCallback(async () => {
    try {
      const stored = await getStyle();
      if (stored && STYLE_OPTIONS.includes(stored as StyleOption)) {
        setStyle(stored as StyleOption);
        return;
      }
      if (stored) {
        await clearStyle();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Tarz yüklenemedi:', error);
    }
  }, []);

  const selectStyle = useCallback(async (value: StyleOption) => {
    setStyle(value);
    await saveStyle(value);
  }, []);

  const value = useMemo(
    () => ({
      style,
      options: STYLE_OPTIONS,
      loadStyle,
      selectStyle
    }),
    [style, loadStyle, selectStyle]
  );

  return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>;
};

export const useStyle = () => {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error('useStyle must be used within StyleProvider');
  }
  return context;
};
