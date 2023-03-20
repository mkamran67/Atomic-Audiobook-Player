import { configureStore } from "@reduxjs/toolkit";
import booksSlice from "./components/Library/booksSlice";

const store = configureStore({
  reducer: {
    books: booksSlice,
  },
});

export default store;
