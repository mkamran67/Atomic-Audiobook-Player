import { createSlice } from "@reduxjs/toolkit";

let initialState: boolean = false;

// Read books from settings save location
const loadingSlice = createSlice({
  name: "loading",
  initialState: initialState,
  reducers: {
    setLoading: (_state) => {
      return true;
    },

    clearLoading: (_state) => {
      return false;
    },
  },
});

export const { setLoading, clearLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
