export interface BookData {
  title: string;
  author?: string;
  cover?: string;
  dirPath: string;
  length?: number;
}

export interface MinimumChapterDetails {
  path: string;
  length: number;
}
export interface BookDetails {
  totalTracks: number;
  chapterList: MinimumChapterDetails[];
  totalLength?: number;
  title?: string;
  author?: string;
  year?: number;
  cover?: string;
  totalSize?: number;
}

export interface PreviouslyPlayedBook {
  currentChapter: string;
  currentTrack: number;
  currentTime: number;
  totalTracks: number;
  title?: string;
  author?: string;
  year?: number;
  cover?: string;
  totalSize: number;
  chapterList: string[];
  totalLength?: number;
}
