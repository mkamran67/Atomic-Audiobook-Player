import { configureStore } from "@reduxjs/toolkit";
import LayoutSlice from "./components/LayoutSlice";
import loadingSlice from "./components/loader/loaderSlice";
import playerSlice from "./components/player/playerSlice";
import settingsSlice from "./components/Settings/settingsSlice";
import booksSlice from "./components/library/booksSlice";

const store = configureStore({
  reducer: {
    library: booksSlice,
    layout: LayoutSlice,
    loader: loadingSlice,
    player: playerSlice, Layout
    potato
    
    Player
    settings: settingsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;