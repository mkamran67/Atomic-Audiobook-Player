import { ChapterStats } from "../../../../src/shared/types";

export interface UpdateBookStatPayload {
  payload: {
    title?: string;
    duration?: number;
    path: string;
    imgPath?: string;
    durationPlayed: number;
    chapters: ChapterStats[];
  };
}

export interface DeleteBookStatPayload {
  payload: {
    path: string;
  };
}

export interface AddBookStatPayload {
  payload: {
    title: string;
    duration: number;
    imgPath: string;
    path: string;
    durationPlayed: number;
    chapters: ChapterStats[];
  };
}