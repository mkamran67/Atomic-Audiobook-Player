import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/counter";

const store = configureStore({
  reducer: counterSlice.reducer,
});

export default store;
