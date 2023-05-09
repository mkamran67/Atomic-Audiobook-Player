import { createSlice } from "@reduxjs/toolkit";
import { BookDetails } from "../../types/book.types";

const initialState: BookDetails = {
  currentChapter: "",
  currentTrack: 0,
  currentTime: 0,
  totalTracks: 0,
  chapterList: [],
};

const playerSlice = createSlice({
  name: "player",
  initialState: initialState,
  reducers: {
    setCurrentTime: (state, { payload }) => {
      return { ...state, currentTime: payload.currentTime };
    },
    setCurrentPlayingChapter: (state, { payload }) => {
      return { ...state, currentlyPlaying: payload.currentlyPlaying };
    },
    setChapterList: (state, { payload }) => {
      return { ...state, chapterList: payload.chapterList };
    },
    setCurrentlyPlayingUrl: (state, { payload }) => {
      return {
        ...state,
        currentlyPlayingUrl: payload.currentlyPlayingUrl,
      };
    },
    setCurrentBook: (state, { payload }) => {
      return { ...state, ...payload.data };
    },
  },
});

export const { setCurrentBook, setCurrentTime, setCurrentPlayingChapter, setChapterList } = playerSlice.actions;

export default playerSlice.reducer;
