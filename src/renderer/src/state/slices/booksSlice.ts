import { createSlice } from "@reduxjs/toolkit";
import { BookState } from "../../types/book.types";

const initialState: BookState = {
  books: [],
};

// Read books from settings save location
const booksSlice = createSlice({
  name: "library",
  initialState: initialState,
  reducers: {
    setBooks: (_state, { payload }) => {
      return { books: payload };
    },
    clearBooks: (_state) => {
      return { books: [] };
    },
    setLibrary: (_state, { payload }) => {

      let books: any = [];

      if (payload.length > 0) {
        payload.forEach((rootDir: any) => {
          books.push(...rootDir.books);
        });
      }

      return { books };

    }
  },
});

export const { setBooks, clearBooks, setLibrary } = booksSlice.actions;

export default booksSlice.reducer;
