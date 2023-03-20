import { createSlice } from "@reduxjs/toolkit";

// Get books here

let initialState = {};

// Read books from settings save location

const booksSlice = createSlice({
  name: "books",
  initialState: initialState,
  reducers: {
    setBooks: (state) => state,
  },
});

export const { setBooks } = booksSlice.actions;

export default booksSlice.reducer;
