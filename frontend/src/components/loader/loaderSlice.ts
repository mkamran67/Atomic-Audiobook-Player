import { createSlice } from "@reduxjs/toolkit";

let initialState: boolean = false;

// Read books from settings save location
const loadingSlice = createSlice({
  name: "loading",
  initialState: initialState,
  reducers: {
    setLoading: (_state) => {
      console.log("Set to True");
      return true;
    },

    clearLoading: (_state) => {
      console.log("Set to False");
      return false;
    },
  },
});

export const { setLoading, clearLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
