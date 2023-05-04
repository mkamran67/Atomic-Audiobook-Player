import { createSlice } from "@reduxjs/toolkit";
import { BookState } from "../../types/bookSlice.types";

const initialState: BookState = {
  books: [],
  error: false,
  message: "",
};

// Read books from settings save location
const booksSlice = createSlice({
  name: "books",
  initialState: initialState,
  reducers: {
    setBooks: (_state, { payload }) => {
      return { error: payload.error, message: payload.message, books: payload.data };
    },
  },
});

export const { setBooks } = booksSlice.actions;

export default booksSlice.reducer;
