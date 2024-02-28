// Shared Types
export type SettingsStructureType = {
  rootDirectories: string[];
  themeMode: 'dark' | 'light' | 'system';
  theme?: string;
  previousBookDirectory: string;
  fontSize?: number;
  volume: number;
}
export interface BookData {
  title: string;
  author?: string;
  cover?: string;
  dirPath: string;
  length?: number;
  isDuplicate?: boolean;
}

type RootDirectoryStructure = {
  rootDirectory: string;
  books: BookData[];
}

export type LibraryStructure = RootDirectoryStructure[];