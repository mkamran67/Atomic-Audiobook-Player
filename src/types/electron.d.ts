import { LibraryBook } from './library';

export interface ElectronAPI {
  selectDirectory: () => Promise<string | null>;

  // Scanner
  startScan: (directories: string[]) => Promise<void>;
  cancelScan: () => Promise<void>;
  onScanProgress: (cb: (data: { percent: number; currentDir: string }) => void) => () => void;
  onBookFound: (cb: (book: LibraryBook) => void) => () => void;
  onScanComplete: (cb: (data: { totalBooks: number }) => void) => () => void;
  onScanError: (cb: (data: { message: string; path?: string }) => void) => () => void;

  // Library persistence
  loadLibrary: () => Promise<LibraryBook[]>;
  removeBooksByDirectory: (directory: string) => Promise<LibraryBook[]>;
  saveLibrary: (books: LibraryBook[]) => Promise<void>;

  // Directory persistence
  loadDirectories: () => Promise<string[]>;
  saveDirectories: (dirs: string[]) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
