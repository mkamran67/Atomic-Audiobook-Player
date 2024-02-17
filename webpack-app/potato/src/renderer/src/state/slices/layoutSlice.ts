import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayoutState {
  error: boolean;
  type: string;
  message: string;
}

interface IncomingStateType {
  payload: LayoutState
}

const initialState: LayoutState = {
  error: false,
  type: '',
  message: '',
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setError: (state, { payload }: IncomingStateType) => {
      return { ...state, ...payload };
    },
    clearError: (state) => {
      return { ...state, error: false, type: '', message: '' };
    }
  },
});

export const { setError, clearError } = layoutSlice.actions;

export default layoutSlice.reducer;