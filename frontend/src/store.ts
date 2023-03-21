import { configureStore } from "@reduxjs/toolkit";
import booksSlice from "./components/Library/booksSlice";
import LayoutSlice from "./components/LayoutSlice";

const store = configureStore({
  reducer: {
    books: booksSlice,
    layout: LayoutSlice,
  },
});

export default store;
