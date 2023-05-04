import { configureStore } from "@reduxjs/toolkit";
import booksSlice from "./components/library/booksSlice";
import LayoutSlice from "./components/LayoutSlice";
import loadingSlice from "./components/loader/loaderSlice";
import playerSlice from "./components/player/playerSlice";

const store = configureStore({
  reducer: {
    books: booksSlice,
    layout: LayoutSlice,
    loader: loadingSlice,
    player: playerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
