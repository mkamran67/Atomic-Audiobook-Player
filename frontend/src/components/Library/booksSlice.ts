import { createSlice } from "@reduxjs/toolkit";
import { BookState } from "../../types/book.types";

const initialState: BookState = {
  books: [],
};

// Read books from settings save location
const booksSlice = createSlice({
  name: "books",
  initialState: initialState,
  reducers: {
    setBooks: (_state, { payload }) => {
      return { books: payload.data };
    },
    clearBooks: (_state) => {
      return { books: [] };
    },
  },
});

export const { setBooks, clearBooks } = booksSlice.actions;

export default booksSlice.reducer;
