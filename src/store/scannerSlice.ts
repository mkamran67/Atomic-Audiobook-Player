import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScannerState {
  isScanning: boolean;
  progress: number;
  currentDir: string;
  error: string | null;
}

const initialState: ScannerState = {
  isScanning: false,
  progress: 0,
  currentDir: '',
  error: null,
};

const scannerSlice = createSlice({
  name: 'scanner',
  initialState,
  reducers: {
    scanStarted(state) {
      state.isScanning = true;
      state.progress = 0;
      state.currentDir = '';
      state.error = null;
    },
    scanProgress(state, action: PayloadAction<{ percent: number; currentDir: string }>) {
      state.progress = action.payload.percent;
      state.currentDir = action.payload.currentDir;
    },
    scanComplete(state) {
      state.isScanning = false;
      state.progress = 100;
      state.currentDir = '';
    },
    scanError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    scanCancelled(state) {
      state.isScanning = false;
      state.currentDir = '';
    },
  },
});

export const { scanStarted, scanProgress, scanComplete, scanError, scanCancelled } = scannerSlice.actions;
export default scannerSlice.reducer;
