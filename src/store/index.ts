import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import libraryReducer from './librarySlice';
import playerReducer from './playerSlice';
import scannerReducer from './scannerSlice';

export const store = configureStore({
  reducer: {
    library: libraryReducer,
    player: playerReducer,
    scanner: scannerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
