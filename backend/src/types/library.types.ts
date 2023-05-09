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
  currentChapter: string;
  currentTrack: number;
  currentTime: number;
  totalTracks: number;
  chapterList: MinimumChapterDetails[];
  title?: string;
  author?: string;
  year?: number;
  cover?: string;
  totalSize?: number;
  totalLength?: number;
}
