import { useState } from 'react';

export type BookStatus = 'not-started' | 'in-progress' | 'completed';

export interface BookProgressData {
  id: number;
  progress: number;
  currentChapter: number;
  totalChapters: number;
  status: BookStatus;
}

interface InitialBook {
  id: number;
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

function buildInitialMap(books: InitialBook[]): Record<number, BookProgressData> {
  const map: Record<number, BookProgressData> = {};
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
  fallback: Record<number, BookProgressData>
): Record<number, BookProgressData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<number, BookProgressData>;
  } catch {
    // ignore
  }
  return fallback;
}

export function useBookProgress(initialBooks: InitialBook[]) {
  const [progressMap, setProgressMap] = useState<Record<number, BookProgressData>>(() =>
    loadFromStorage(buildInitialMap(initialBooks))
  );

  const save = (map: Record<number, BookProgressData>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore
    }
    setProgressMap(map);
  };

  const markChapterComplete = (bookId: number) => {
    const book = progressMap[bookId];
    if (!book || book.status === 'completed') return;
    const newChapter = Math.min(book.currentChapter + 1, book.totalChapters);
    const newProgress = Math.round((newChapter / book.totalChapters) * 100);
    const updated: Record<number, BookProgressData> = {
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

  const markBookComplete = (bookId: number) => {
    const book = progressMap[bookId];
    if (!book) return;
    const updated: Record<number, BookProgressData> = {
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

  const markPreviousChapter = (bookId: number) => {
    const book = progressMap[bookId];
    if (!book || book.currentChapter <= 0) return;
    const newChapter = book.currentChapter - 1;
    const newProgress = Math.round((newChapter / book.totalChapters) * 100);
    const updated: Record<number, BookProgressData> = {
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

  const resetBook = (bookId: number) => {
    const book = progressMap[bookId];
    if (!book) return;
    const updated: Record<number, BookProgressData> = {
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

  const getBookProgress = (bookId: number): BookProgressData | undefined =>
    progressMap[bookId];

  return { progressMap, markChapterComplete, markBookComplete, markPreviousChapter, resetBook, getBookProgress };
}
