import { BookDataType } from "./library.types";

export interface BookState {
  books: BookDataType[];
  error: boolean;
  message: string;
}
