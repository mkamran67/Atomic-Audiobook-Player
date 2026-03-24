import { useState } from 'react';

export type BookStatus = 'not-started' | 'in-progress' | 'completed';

export interface BookProgressData {
  id: string;
  progress: number;
  currentChapter: number;
  totalChapters: number;
  status: BookStatus;
}

interface InitialBook {
  id: string;
  progress: number;
  currentChapter: number;
  totalChapters: number;
}

const STORAGE_KEY = 'audiobook_progress';

function deriveStatus(progress: number): BookStatus {
  if (progress <= 0) return 'not-started';
  if (progress >= 100) return 'completed';
  return 'in-progress';
}

function buildInitialMap(books: InitialBook[]): Record<string, BookProgressData> {
  const map: Record<string, BookProgressData> = {};
  books.forEach((b) => {
    map[b.id] = {
      id: b.id,
      progress: b.progress,
      currentChapter: b.currentChapter,
      totalChapters: b.totalChapters,
      status: deriveStatus(b.progress),
    };
  });
  return map;
}

function loadFromStorage(
  fallback: Record<string, BookProgressData>
): Record<string, BookProgressData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, BookProgressData>;
  } catch {
    // ignore
  }
  return fallback;
}

export function useBookProgress(initialBooks: InitialBook[]) {
  const [progressMap, setProgressMap] = useState<Record<string, BookProgressData>>(() =>
    loadFromStorage(buildInitialMap(initialBooks))
  );

  const save = (map: Record<string, BookProgressData>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore
    }
    setProgressMap(map);
  };

  const markChapterComplete = (bookId: string) => {
    const book = progressMap[bookId];
    if (!book || book.status === 'completed') return;
    const newChapter = Math.min(book.currentChapter + 1, book.totalChapters);
    const newProgress = Math.round((newChapter / book.totalChapters) * 100);
    const updated: Record<string, BookProgressData> = {
      ...progressMap,
      [bookId]: {
        ...book,
        currentChapter: newChapter,
        progress: newProgress,
        status: deriveStatus(newProgress),
      },
    };
    save(updated);
  };

  const markBookComplete = (bookId: string) => {
    const book = progressMap[bookId];
    if (!book) return;
    const updated: Record<string, BookProgressData> = {
      ...progressMap,
      [bookId]: {
        ...book,
        currentChapter: book.totalChapters,
        progress: 100,
        status: 'completed',
      },
    };
    save(updated);
  };

  const markPreviousChapter = (bookId: string) => {
    const book = progressMap[bookId];
    if (!book || book.currentChapter <= 0) return;
    const newChapter = book.currentChapter - 1;
    const newProgress = Math.round((newChapter / book.totalChapters) * 100);
    const updated: Record<string, BookProgressData> = {
      ...progressMap,
      [bookId]: {
        ...book,
        currentChapter: newChapter,
        progress: newProgress,
        status: deriveStatus(newProgress),
      },
    };
    save(updated);
  };

  const resetBook = (bookId: string) => {
    const book = progressMap[bookId];
    if (!book) return;
    const updated: Record<string, BookProgressData> = {
      ...progressMap,
      [bookId]: {
        ...book,
        currentChapter: 0,
        progress: 0,
        status: 'not-started',
      },
    };
    save(updated);
  };

  const getBookProgress = (bookId: string): BookProgressData | undefined =>
    progressMap[bookId];

  return { progressMap, markChapterComplete, markBookComplete, markPreviousChapter, resetBook, getBookProgress };
}
