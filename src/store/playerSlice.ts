import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface Track {
  id: string;
  title: string;
  author: string;
  cover: string;
  duration: string;
  currentChapter?: number;
  totalChapters?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  playerCollapsed: boolean;
}

const initialState: PlayerState = {
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  playerCollapsed: true,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack(state, action: PayloadAction<Track>) {
      state.currentTrack = action.payload;
    },
    setPlaylist(state, action: PayloadAction<Track[]>) {
      state.playlist = action.payload;
    },
    addToQueue(state, action: PayloadAction<Track>) {
      if (!state.playlist.some((t) => t.id === action.payload.id)) {
        state.playlist.push(action.payload);
      }
    },
    removeFromQueue(state, action: PayloadAction<string>) {
      state.playlist = state.playlist.filter((t) => t.id !== action.payload);
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setPlayerCollapsed(state, action: PayloadAction<boolean>) {
      state.playerCollapsed = action.payload;
    },
  },
});

export const {
  setCurrentTrack,
  setPlaylist,
  addToQueue,
  removeFromQueue,
  setIsPlaying,
  setPlayerCollapsed,
} = playerSlice.actions;
export default playerSlice.reducer;
