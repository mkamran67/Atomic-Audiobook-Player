import { AudioChapter } from './scanner';

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  cover: string;
  rating: number;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  year: number;
  duration: string;
  durationMs: number;
  liked: boolean;
  folderPath: string;
  chapters: AudioChapter[];
  addedAt: number;
  narrator?: string;
  lastPlayedAt?: number;
}

export const genreColors: Record<string, string> = {
  Fantasy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Fiction: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Novel: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'Dark Academia': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Dark Romance': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'Gothic Fantasy': 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  'Epic Fantasy': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Dark Fantasy': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Ocean Fantasy': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  'Academic Novel': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  'Magical Realism': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'Gothic Horror': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'Military Fantasy': 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-400',
  'Fantasy Romance': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
  Mythology: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500',
};
