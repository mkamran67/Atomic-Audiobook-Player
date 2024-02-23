// Shared Types
export type SettingsStructureType = {
  rootDirectories: string[];
  themeMode: 'dark' | 'light' | 'system';
  theme?: string;
  previousBookDirectory: string;
  fontSize?: number;
  volume: number;
}
