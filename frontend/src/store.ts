import { configureStore } from "@reduxjs/toolkit";
import booksSlice from "./components/Library/booksSlice";
import LayoutSlice from "./components/LayoutSlice";
import loadingSlice from "./components/loader/loaderSlice";

const store = configureStore({
  reducer: {
    books: booksSlice,
    layout: LayoutSlice,
    loader: loadingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
