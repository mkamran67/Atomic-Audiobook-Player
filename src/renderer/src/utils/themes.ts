export type ThemeColors = {
  'base-100': string;
  'base-200': string;
  'base-300': string;
  'base-content': string;
  primary: string;
  'primary-content': string;
  secondary: string;
  accent: string;
  neutral: string;
  info: string;
  success: string;
  warning: string;
  error: string;
};

export type ThemePreset = {
  id: string;
  label: string;
  family: string;
  mode: 'dark' | 'light';
  colors: ThemeColors;
};

export const THEME_PRESETS: ThemePreset[] = [
  // ── Dark Themes ──
  {
    id: 'atomicDark',
    label: 'Atomic',
    family: 'atomic',
    mode: 'dark',
    colors: {
      'base-100': '#0F0F1A',
      'base-200': '#161625',
      'base-300': '#1F1F35',
      'base-content': '#E8E6F0',
      primary: '#A78BFA',
      'primary-content': '#1a1025',
      secondary: '#34D399',
      accent: '#FB923C',
      neutral: '#1A1A2E',
      info: '#67C3F3',
      success: '#36D399',
      warning: '#FBBD23',
      error: '#F87272',
    },
  },
  {
    id: 'midnightBlue',
    label: 'Midnight',
    family: 'midnight',
    mode: 'dark',
    colors: {
      'base-100': '#0B1120',
      'base-200': '#111827',
      'base-300': '#1E293B',
      'base-content': '#E2E8F0',
      primary: '#60A5FA',
      'primary-content': '#0B1120',
      secondary: '#38BDF8',
      accent: '#A78BFA',
      neutral: '#0F172A',
      info: '#7DD3FC',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#FB7185',
    },
  },
  {
    id: 'tokyoNight',
    label: 'Tokyo Night',
    family: 'tokyo',
    mode: 'dark',
    colors: {
      'base-100': '#1A1B26',
      'base-200': '#16161E',
      'base-300': '#232433',
      'base-content': '#C0CAF5',
      primary: '#BB9AF7',
      'primary-content': '#1A1B26',
      secondary: '#7DCFFF',
      accent: '#FF9E64',
      neutral: '#1A1B26',
      info: '#7AA2F7',
      success: '#9ECE6A',
      warning: '#E0AF68',
      error: '#F7768E',
    },
  },
  {
    id: 'emeraldDark',
    label: 'Emerald',
    family: 'emerald',
    mode: 'dark',
    colors: {
      'base-100': '#0D1117',
      'base-200': '#161B22',
      'base-300': '#21262D',
      'base-content': '#E6EDF3',
      primary: '#34D399',
      'primary-content': '#052E16',
      secondary: '#6EE7B7',
      accent: '#2DD4BF',
      neutral: '#0D1117',
      info: '#58A6FF',
      success: '#3FB950',
      warning: '#D29922',
      error: '#F85149',
    },
  },
  {
    id: 'rosePine',
    label: 'Rosé Pine',
    family: 'rosepine',
    mode: 'dark',
    colors: {
      'base-100': '#191724',
      'base-200': '#1F1D2E',
      'base-300': '#26233A',
      'base-content': '#E0DEF4',
      primary: '#EBBCBA',
      'primary-content': '#191724',
      secondary: '#F6C177',
      accent: '#C4A7E7',
      neutral: '#191724',
      info: '#9CCFD8',
      success: '#31748F',
      warning: '#F6C177',
      error: '#EB6F92',
    },
  },
  {
    id: 'crimsonNight',
    label: 'Crimson',
    family: 'crimson',
    mode: 'dark',
    colors: {
      'base-100': '#1C1017',
      'base-200': '#231520',
      'base-300': '#2E1D2A',
      'base-content': '#F0E4EC',
      primary: '#F87171',
      'primary-content': '#1C1017',
      secondary: '#FB923C',
      accent: '#FBBF24',
      neutral: '#1C1017',
      info: '#67C3F3',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#EF4444',
    },
  },

  // ── Light Themes ──
  {
    id: 'atomicLight',
    label: 'Atomic',
    family: 'atomic',
    mode: 'light',
    colors: {
      'base-100': '#FAFAFE',
      'base-200': '#F0EEF8',
      'base-300': '#E0DDEE',
      'base-content': '#1C1B2E',
      primary: '#7C3AED',
      'primary-content': '#FFFFFF',
      secondary: '#059669',
      accent: '#EA580C',
      neutral: '#E2E0EC',
      info: '#2196F3',
      success: '#16A34A',
      warning: '#D97706',
      error: '#DC2626',
    },
  },
  {
    id: 'snowfall',
    label: 'Snowfall',
    family: 'midnight',
    mode: 'light',
    colors: {
      'base-100': '#F8FAFC',
      'base-200': '#F1F5F9',
      'base-300': '#E2E8F0',
      'base-content': '#0F172A',
      primary: '#3B82F6',
      'primary-content': '#FFFFFF',
      secondary: '#06B6D4',
      accent: '#8B5CF6',
      neutral: '#E2E8F0',
      info: '#0EA5E9',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
  {
    id: 'lavenderMist',
    label: 'Lavender',
    family: 'tokyo',
    mode: 'light',
    colors: {
      'base-100': '#FAF5FF',
      'base-200': '#F3E8FF',
      'base-300': '#E9D5FF',
      'base-content': '#2E1065',
      primary: '#8B5CF6',
      'primary-content': '#FFFFFF',
      secondary: '#A78BFA',
      accent: '#F97316',
      neutral: '#EDE9FE',
      info: '#818CF8',
      success: '#4ADE80',
      warning: '#FB923C',
      error: '#F43F5E',
    },
  },
  {
    id: 'mintFresh',
    label: 'Mint',
    family: 'emerald',
    mode: 'light',
    colors: {
      'base-100': '#F0FDF4',
      'base-200': '#DCFCE7',
      'base-300': '#BBF7D0',
      'base-content': '#14532D',
      primary: '#059669',
      'primary-content': '#FFFFFF',
      secondary: '#10B981',
      accent: '#14B8A6',
      neutral: '#D1FAE5',
      info: '#3B82F6',
      success: '#16A34A',
      warning: '#CA8A04',
      error: '#DC2626',
    },
  },
  {
    id: 'roseGarden',
    label: 'Rose Garden',
    family: 'rosepine',
    mode: 'light',
    colors: {
      'base-100': '#FFF1F2',
      'base-200': '#FFE4E6',
      'base-300': '#FECDD3',
      'base-content': '#4C0519',
      primary: '#E11D48',
      'primary-content': '#FFFFFF',
      secondary: '#F43F5E',
      accent: '#A855F7',
      neutral: '#FFE4E6',
      info: '#38BDF8',
      success: '#4ADE80',
      warning: '#FBBF24',
      error: '#BE123C',
    },
  },
  {
    id: 'sandstone',
    label: 'Sandstone',
    family: 'crimson',
    mode: 'light',
    colors: {
      'base-100': '#FFFBEB',
      'base-200': '#FEF3C7',
      'base-300': '#FDE68A',
      'base-content': '#451A03',
      primary: '#B45309',
      'primary-content': '#FFFFFF',
      secondary: '#D97706',
      accent: '#EA580C',
      neutral: '#FEF3C7',
      info: '#0284C7',
      success: '#16A34A',
      warning: '#A16207',
      error: '#DC2626',
    },
  },
];

export const DARK_THEMES = THEME_PRESETS.filter((t) => t.mode === 'dark');
export const LIGHT_THEMES = THEME_PRESETS.filter((t) => t.mode === 'light');

export function getThemeById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((t) => t.id === id);
}

export function getFamilyPair(id: string): ThemePreset | undefined {
  const theme = getThemeById(id);
  if (!theme) return undefined;
  const targetMode = theme.mode === 'dark' ? 'light' : 'dark';
  return THEME_PRESETS.find((t) => t.family === theme.family && t.mode === targetMode);
}

export function resolveSystemTheme(selectedThemeId: string): string {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = getThemeById(selectedThemeId);
  if (!theme) return prefersDark ? 'atomicDark' : 'atomicLight';

  // If the selected theme already matches OS preference, keep it
  if ((prefersDark && theme.mode === 'dark') || (!prefersDark && theme.mode === 'light')) {
    return selectedThemeId;
  }

  // Otherwise, find the family pair
  const pair = getFamilyPair(selectedThemeId);
  return pair ? pair.id : prefersDark ? 'atomicDark' : 'atomicLight';
}
