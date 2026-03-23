import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LibraryBook, libraryBooks } from '../mocks/library';

interface LibraryState {
  books: LibraryBook[];
}

const initialState: LibraryState = {
  books: libraryBooks,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setBooks(state, action: PayloadAction<LibraryBook[]>) {
      state.books = action.payload;
    },
    toggleLike(state, action: PayloadAction<number>) {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) {
        book.liked = !book.liked;
      }
    },
    updateBookProgress(state, action: PayloadAction<{ id: number; progress: number }>) {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.progress = action.payload.progress;
      }
    },
    updateBookStatus(state, action: PayloadAction<{ id: number; status: LibraryBook['status'] }>) {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.status = action.payload.status;
      }
    },
  },
});

export const { setBooks, toggleLike, updateBookProgress, updateBookStatus } = librarySlice.actions;
export default librarySlice.reducer;
