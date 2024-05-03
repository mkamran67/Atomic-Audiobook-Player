import { configureStore } from '@reduxjs/toolkit';
import settingsSlice from '../components/settings/settingsSlice';
import booksSlice from './slices/booksSlice';
import loadingSlice from './slices/loaderSlice';
import playerSlice from './slices/playerSlice';
import statsSlice from './slices/statsSlice';
import errorsSlice from './slices/errorsSlice';
import searchSlice from './slices/searchSlice';

const store = configureStore({
  reducer: {
    library: booksSlice,
    loader: loadingSlice,
    player: playerSlice,
    settings: settingsSlice,
    stats: statsSlice,
    errors: errorsSlice,
    search: searchSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
