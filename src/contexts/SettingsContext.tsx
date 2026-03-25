import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Settings {
  // Appearance
  compactCards: boolean;
  showProgress: boolean;
  showBadges: boolean;
  // Audio
  defaultSpeed: number;
  sleepTimer: number;
  autoNextChapter: boolean;
  loudnessEq: boolean;
  // Accessibility
  appLanguage: string;
  autoTranslate: boolean;
  translateTargetLang: string;
  highContrast: boolean;
  reduceMotion: boolean;
  largerTargets: boolean;
  dyslexicFont: boolean;
  screenReaderHints: boolean;
  // Notifications
  readingGoals: boolean;
  weeklyDigest: boolean;
  bookmarkReminders: boolean;
}

const DEFAULTS: Settings = {
  compactCards: false,
  showProgress: true,
  showBadges: true,
  defaultSpeed: 1.0,
  sleepTimer: 30,
  autoNextChapter: true,
  loudnessEq: true,
  appLanguage: 'en',
  autoTranslate: false,
  translateTargetLang: 'en',
  highContrast: false,
  reduceMotion: false,
  largerTargets: false,
  dyslexicFont: false,
  screenReaderHints: false,
  readingGoals: true,
  weeklyDigest: false,
  bookmarkReminders: true,
};

const STORAGE_KEY = 'atomic_settings';

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULTS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore corrupt data
  }
  return { ...DEFAULTS };
}

function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage errors
  }
}

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
