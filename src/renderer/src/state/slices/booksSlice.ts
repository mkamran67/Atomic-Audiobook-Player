import { createSlice } from "@reduxjs/toolkit";
import { LibraryBookSetType } from "../../types/library.types";

const initialState: LibraryBookSetType[] = [
  {
    books: [],
    rootDirectory: "",
  }
]

// Read books from settings save location
const booksSlice = createSlice({
  name: "library",
  initialState: initialState,
  reducers: {
    setBooks: (_state, { payload }) => {
      return payload;
    },
    clearBooks: (_state) => {
      return initialState;
    },
    appendLibrary: (state, { payload }) => {
      return [...state, ...payload];
    }
  },
});

export const { setBooks, clearBooks, appendLibrary } = booksSlice.actions;

export default booksSlice.reducer;
