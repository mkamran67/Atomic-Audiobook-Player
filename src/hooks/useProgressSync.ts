import { useEffect, useRef, useCallback } from 'react';
import type { BookProgressData } from './useBookProgress';
import type { LibraryBook } from '../types/library';
import type { AppDispatch } from '../store';
import { updateBookProgress, updateBookStatus } from '../store/librarySlice';

const SYNC_INTERVAL_MS = 30_000;

export function useProgressSync(
  progressMap: Record<string, BookProgressData>,
  currentBookId: string | null,
  isPlaying: boolean,
  books: LibraryBook[],
  dispatch: AppDispatch,
) {
  const progressMapRef = useRef(progressMap);
  const booksRef = useRef(books);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { progressMapRef.current = progressMap; }, [progressMap]);
  useEffect(() => { booksRef.current = books; }, [books]);

  const syncToDisk = useCallback(() => {
    if (!currentBookId) return;
    const prog = progressMapRef.current[currentBookId];
    if (!prog) return;

    dispatch(updateBookProgress({ id: currentBookId, progress: prog.progress }));
    dispatch(updateBookStatus({ id: currentBookId, status: prog.status }));

    const updatedBooks = booksRef.current.map((b) =>
      b.id === currentBookId
        ? { ...b, progress: prog.progress, status: prog.status }
        : b,
    );

    try {
      window.electronAPI.saveLibrary(updatedBooks);
    } catch {
      // ignore persist failure
    }
  }, [currentBookId, dispatch]);

  // Periodic sync while playing
  useEffect(() => {
    if (isPlaying && currentBookId) {
      intervalRef.current = setInterval(syncToDisk, SYNC_INTERVAL_MS);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentBookId, syncToDisk]);

  // Sync on pause
  const wasPLayingRef = useRef(false);
  useEffect(() => {
    if (wasPLayingRef.current && !isPlaying) {
      syncToDisk();
    }
    wasPLayingRef.current = isPlaying;
  }, [isPlaying, syncToDisk]);

  // Sync on beforeunload
  useEffect(() => {
    window.addEventListener('beforeunload', syncToDisk);
    return () => window.removeEventListener('beforeunload', syncToDisk);
  }, [syncToDisk]);
}
