export interface AudioChapter {
  index: number;
  title: string;
  filePath: string;
  durationMs: number;
}

export interface ScannedBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  narrator?: string;
  year: number;
  cover: string;
  folderPath: string;
  chapters: AudioChapter[];
  durationMs: number;
}

export type ScannerOutMessage =
  | { type: 'progress'; percent: number; currentDir: string }
  | { type: 'book-discovered'; book: ScannedBook }
  | { type: 'scan-complete'; totalBooks: number }
  | { type: 'error'; message: string; path?: string };

export type ScannerInMessage =
  | { type: 'start-scan'; directories: string[] }
  | { type: 'cancel-scan' };
