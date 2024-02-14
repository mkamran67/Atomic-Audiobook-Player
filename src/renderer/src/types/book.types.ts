import { BookDataType } from './library.types'

export interface BookState {
  books: BookDataType[]
}

export interface MinimumChapterDetails {
  path: string
  name?: string
  length: number
}

export interface BookDetails {
  currentChapter: string
  currentTrack: number
  currentTime: number
  totalTracks: number
  chapterList: MinimumChapterDetails[]
  title?: string
  author?: string
  year?: number
  cover?: string
  totalSize?: number
  totalLength?: number
}
