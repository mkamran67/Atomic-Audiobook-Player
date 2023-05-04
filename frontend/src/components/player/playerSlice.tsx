import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTime: "",
  currentPlayingChapter: "",
  chapterList: [],
  currentlyPlayingUrl: "",
  bookCover: "",
  bookName: "",
  bookAuthor: "",
};

const playerSlice = createSlice({
  name: "playerStats",
  initialState,
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
      return { ...state, ...payload };
    },
  },
});

export const { setCurrentTime, setCurrentPlayingChapter: setCurrentlyPlaying, setChapterList } = playerSlice.actions;

export default playerSlice.reducer;
