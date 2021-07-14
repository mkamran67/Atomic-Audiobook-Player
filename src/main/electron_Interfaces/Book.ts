export default interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  comments: string;
  length: number;
  completed: boolean;
  composers: string[];
  date_published: Date;
  publisher: string;
  genre: string;
  isbn: string;
  folder_path: string;
  cover_path: string;
  current_position: number;
  book_number: number;
  chapter_number: number;
  chapter_title: string;
  bitrate: string;
  year: number;
  abridged: boolean;
  language: string;
  series_name: string;
}
