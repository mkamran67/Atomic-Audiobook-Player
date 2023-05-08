export interface BookData {
  title: string;
  artist?: string;
  cover?: string;
  dirPath: string;
  length?: number;
}

export interface BookDetails {
  size: number;
  title?: string;
  artist?: string;
  year?: number;
  cover?: string;
  chapterPath: string;
  track: number;
  totalTrack: number;
}
