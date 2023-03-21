import { createSlice } from "@reduxjs/toolkit";

// Get books here

let initialState: any[] = [];

// Read books from settings save location
const booksSlice = createSlice({
  name: "books",
  initialState: initialState,
  reducers: {
    setBooks: (_state, { payload }) => {
      return payload;
    },
  },
});

export const { setBooks } = booksSlice.actions;

export default booksSlice.reducer;
