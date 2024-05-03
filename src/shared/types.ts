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

export interface BookStatStructure {
  bookTitle: string;
  bookAuthor: string;
  bookPath: string;
  chapterCount: number;
  startDateAndTime: Date;
  endedDateAndTime: Date | 'TBD';
  currentChapterPath: string;
  currentTime: number;
  currentTrack: number;
  totalLength: number;
  coverPath: string;
  bookDirectory: string;
  markedForPrevious: boolean;
}

export interface StatsFileStructure {
  bookStats: BookStatStructure[];
}

export interface SaveBookProgressPayload {
  currentTime: number;
  currentChapterURL: string;
  duration: number;
  bookURL: string;
  currentTrack: number;
  markedForCompletion: boolean;
};

export interface MinimumChapterDetails {
  path: string;
  name?: string;
  length: number;
}

export interface BookDetails {
  currentChapter: string;
  currentTrack: number;
  currentTime: number;
  totalTracks: number;
  chapterList: MinimumChapterDetails[];
  title?: string;
  author?: string;
  year?: number;
  coverPath?: string;
  totalSize?: number;
  totalLength?: number;
  bookPath: string;
}





export type LibraryStructure = RootDirectoryStructure[];