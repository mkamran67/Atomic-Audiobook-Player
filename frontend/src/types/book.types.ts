import { BookDataType } from "./library.types";

export interface BookState {
  books: BookDataType[];
}

export interface MinimumChapterDetails {
  path: string;
  length: number;
}

export interface BookDetails {
  currentTime: number;
  currentPlayingChapter: string;
  size: number;
  title?: string;
  author?: string;
  year?: number;
  cover?: string;
  chapterPath: string;
  length?: number;
  totalLength?: number;
  currentlyPlayingUrl?: string;
  totalTracks: number;
  chapterList: MinimumChapterDetails[];
  totalSize?: number;
}
