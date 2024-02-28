import { configureStore } from '@reduxjs/toolkit'
import settingsSlice from '../components/settings/settingsSlice'
import booksSlice from './slices/booksSlice'
import layoutSlice from './slices/layoutSlice'
import loadingSlice from './slices/loaderSlice'
import playerSlice from './slices/playerSlice'

const store = configureStore({
  reducer: {
    library: booksSlice,
    layout: layoutSlice,
    loader: loadingSlice,
    player: playerSlice,
    settings: settingsSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
