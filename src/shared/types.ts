// Shared Types
export enum LibraryView {
  GALLERY = 'gallery',
  LIST = 'list',
}

export type SettingsStructureType = {
  rootDirectories: string[];
  themeMode: 'dark' | 'light' | 'system';
  theme?: string;
  previousBookDirectory: string;
  fontSize?: number;
  volume: number;
  libraryView: LibraryView;
};

export interface ChapterStats {
  chapters: number;
  length: number;
  comments: string[];
}

export interface statsBooksState {
  title: string;
  duration: number;
  path: string;
  imgPath: string;
  durationPlayed: number;
  chapters: ChapterStats[];
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
};



export type LibraryStructure = RootDirectoryStructure[];