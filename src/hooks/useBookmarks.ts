import { useState } from 'react';

const STORAGE_KEY = 'audiobook_bookmarks';

export interface Bookmark {
  id: string;
  bookId: number;
  time: number;
  label: string;
  note?: string;
  createdAt: number;
}

function load(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Bookmark[]) : [];
  } catch {
    return [];
  }
}

function persist(list: Bookmark[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(load);

  const save = (list: Bookmark[]) => {
    persist(list);
    setBookmarks(list);
  };

  const addBookmark = (bookId: number, time: number, label: string): Bookmark => {
    const entry: Bookmark = {
      id: `${bookId}-${Math.round(time)}-${Date.now()}`,
      bookId,
      time,
      label,
      createdAt: Date.now(),
    };
    const updated = [...bookmarks, entry].sort((a, b) => a.time - b.time);
    save(updated);
    return entry;
  };

  const updateBookmark = (id: string, label: string, note?: string) => {
    save(
      bookmarks.map((b) =>
        b.id === id ? { ...b, label, note: note?.trim() || undefined } : b
      )
    );
  };

  const removeBookmark = (id: string) => {
    save(bookmarks.filter((b) => b.id !== id));
  };

  const getBookmarks = (bookId: number): Bookmark[] =>
    bookmarks.filter((b) => b.bookId === bookId).sort((a, b) => a.time - b.time);

  return { bookmarks, addBookmark, updateBookmark, removeBookmark, getBookmarks };
}
