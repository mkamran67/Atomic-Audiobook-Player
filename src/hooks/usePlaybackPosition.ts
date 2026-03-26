import { useCallback, useEffect, useRef } from 'react';

const STORAGE_KEY = 'audiobook_playback_position';

export interface PlaybackPosition {
  bookId: string;
  chapterIndex: number;
  timeOffset: number;
  updatedAt: number;
}

function readPosition(): PlaybackPosition | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PlaybackPosition;
  } catch {
    // ignore
  }
  return null;
}

function writePosition(pos: PlaybackPosition): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  } catch {
    // ignore
  }
}

export function usePlaybackPosition(
  bookId: string | null,
  chapterIndex: number,
  getCurrentTime: () => number,
  isPlaying: boolean,
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const savePosition = useCallback(() => {
    if (!bookId) return;
    const time = getCurrentTime();
    writePosition({
      bookId,
      chapterIndex,
      timeOffset: time,
      updatedAt: Date.now(),
    });
  }, [bookId, chapterIndex, getCurrentTime]);

  // Auto-save every 5 seconds while playing
  useEffect(() => {
    if (isPlaying && bookId) {
      intervalRef.current = setInterval(savePosition, 5000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, bookId, savePosition]);

  // Save on pause
  useEffect(() => {
    if (!isPlaying && bookId) {
      savePosition();
    }
  }, [isPlaying, bookId, savePosition]);

  // Save on page unload
  useEffect(() => {
    const handleUnload = () => savePosition();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [savePosition]);

  const loadPosition = useCallback((): PlaybackPosition | null => {
    return readPosition();
  }, []);

  const clearPosition = useCallback((id: string) => {
    const pos = readPosition();
    if (pos?.bookId === id) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { savePosition, loadPosition, clearPosition };
}
