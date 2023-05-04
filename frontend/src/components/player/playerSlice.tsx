import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTime: "",
  currentlyPlaying: "",
  chapterList: [],
};

const playerSlice = createSlice({
  name: "playerStats",
  initialState,
  reducers: {
    setCurrentTime: (state, { payload }) => {
      return { ...state, currentTime: payload.currentTime };
    },
    setCurrentlyPlaying: (state, { payload }) => {
      return { ...state, currentlyPlaying: payload.currentlyPlaying };
    },
    setChapterList: (state, { payload }) => {
      return { ...state, chapterList: payload.chapterList };
    },
  },
});

export const {} = playerSlice.actions;

export default playerSlice.reducer;
