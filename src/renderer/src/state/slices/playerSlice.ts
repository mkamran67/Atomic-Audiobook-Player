import { createSlice } from "@reduxjs/toolkit";
import { BookDetails } from "../../../../../src/shared/types";


const initialState: BookDetails = {
  currentChapter: "",
  currentTrack: 0,
  currentTime: 0,
  totalTracks: 0,
  chapterList: [],
  bookPath: ""
};

const playerSlice = createSlice({
  name: "player",
  initialState: initialState,
  reducers: {
    setCurrentTime: (state, { payload }) => {
      return { ...state, currentTime: payload.currentTime };
    },
    setCurrentPlayingChapter: (state, { payload }) => {
      console.log(payload);
      return { ...state, currentlyPlaying: payload.currentlyPlaying };
    },
    setChapterList: (state, { payload }) => {

      const chapters = payload.chapterList.map((chapter: string) => {
        const names = chapter.split("/");

        return {
          name: chapter.split("/")[names.length - 1],
          path: chapter,
        };
      });

      return { ...state, chapterList: chapters };
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

export const { setCurrentBook, setCurrentTime, setCurrentPlayingChapter, setChapterList } = playerSlice.actions;

export default playerSlice.reducer;
