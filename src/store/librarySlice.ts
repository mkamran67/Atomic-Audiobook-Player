import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LibraryBook } from '../types/library';

interface LibraryState {
  books: LibraryBook[];
}

const initialState: LibraryState = {
  books: [],
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setBooks(state, action: PayloadAction<LibraryBook[]>) {
      state.books = action.payload;
    },
    addBook(state, action: PayloadAction<LibraryBook>) {
      const index = state.books.findIndex((b) => b.id === action.payload.id);
      if (index >= 0) {
        state.books[index] = action.payload;
      } else {
        state.books.push(action.payload);
      }
    },
    toggleLike(state, action: PayloadAction<string>) {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) {
        book.liked = !book.liked;
      }
    },
    updateBookProgress(state, action: PayloadAction<{ id: string; progress: number }>) {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.progress = action.payload.progress;
      }
    },
    updateBookStatus(state, action: PayloadAction<{ id: string; status: LibraryBook['status'] }>) {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.status = action.payload.status;
      }
    },
  },
});

export const { setBooks, addBook, toggleLike, updateBookProgress, updateBookStatus } = librarySlice.actions;
export default librarySlice.reducer;
