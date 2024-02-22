// Shared Types
export interface SettingsStructureType {
  rootDirectories: string[];
  themeMode: 'dark' | 'light' | 'system';
  theme?: string;
  previoousBookDirectory: string;
  fontSize?: number;
  volume: number;
}