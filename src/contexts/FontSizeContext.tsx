import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type FontSize = 'sm' | 'md' | 'lg';

const STORAGE_KEY = 'atomic_font_size';

const SIZE_PX: Record<FontSize, string> = {
  sm: '14px',
  md: '16px',
  lg: '18px',
};

interface FontSizeCtx {
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeCtx>({
  fontSize: 'md',
  setFontSize: () => {},
});

function readStored(): FontSize {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'sm' || v === 'md' || v === 'lg') return v;
  return 'md';
}

function applySize(size: FontSize) {
  document.documentElement.style.fontSize = SIZE_PX[size];
}

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>(readStored);

  useEffect(() => {
    applySize(fontSize);
  }, [fontSize]);

  function setFontSize(s: FontSize) {
    setFontSizeState(s);
    localStorage.setItem(STORAGE_KEY, s);
    applySize(s);
  }

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  return useContext(FontSizeContext);
}
