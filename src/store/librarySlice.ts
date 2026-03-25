import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LibraryBook } from '../types/library';

interface LibraryState {
  books: LibraryBook[];
  loaded: boolean;
}

const initialState: LibraryState = {
  books: [],
  loaded: false,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setBooks(state, action: PayloadAction<LibraryBook[]>) {
      state.books = action.payload;
      state.loaded = true;
    },
    setLibraryLoaded(state) {
      state.loaded = true;
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
    removeBooksByDirectory(state, action: PayloadAction<string>) {
      state.books = state.books.filter(b => !b.folderPath.startsWith(action.payload));
    },
    updateBookStatus(state, action: PayloadAction<{ id: string; status: LibraryBook['status'] }>) {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.status = action.payload.status;
      }
    },
  },
});

export const { setBooks, setLibraryLoaded, addBook, removeBooksByDirectory, toggleLike, updateBookProgress, updateBookStatus } = librarySlice.actions;
export default librarySlice.reducer;
