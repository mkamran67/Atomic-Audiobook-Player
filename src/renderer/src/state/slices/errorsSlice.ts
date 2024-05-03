import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorsState {
  error: boolean;
  errorMessage: string;
  electronError: boolean;
  electronErrorMessage: string;
  warning: boolean;
  warningMessage: string;
  info: boolean;
  infoMessage: string;
}

const initialState: ErrorsState = {
  error: false,
  errorMessage: '',
  electronError: false,
  electronErrorMessage: '',
  warning: false,
  warningMessage: '',
  info: false,
  infoMessage: '',
};

const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      return { ...state, error: true, errorMessage: action.payload };
    },
    clearError: (state) => {
      return { ...state, error: false, errorMessage: '' };
    },
    setElectronError: (state, action: PayloadAction<string>) => {
      return { ...state, electronError: true, electronErrorMessage: action.payload };
    },
    clearErrorError: (state) => {
      return { ...state, electronError: false, electronErrorMessage: '' };
    },
    setWarning: (state, action: PayloadAction<string>) => {
      return { ...state, warning: true, warningMessage: action.payload };
    },
    clearWarning: (state) => {
      return { ...state, warning: false, warningMessage: '' };
    },
    setInfo: (state, action: PayloadAction<string>) => {
      return { ...state, info: true, infoMessage: action.payload };
    },
    clearInfo: (state) => {
      return { ...state, info: false, infoMessage: '' };
    },
  },
});

export const {
  setError,
  clearError,
  clearErrorError,
  clearInfo,
  clearWarning,
  setElectronError,
  setInfo,
  setWarning
} = errorsSlice.actions;

export default errorsSlice.reducer;