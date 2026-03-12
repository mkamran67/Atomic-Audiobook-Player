import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomThemeColors, LibraryView, SettingsStructureType } from '../../../../shared/types';

const initialState: SettingsStructureType = {
  volume: 100,
  theme: 'atomicDark',
  useSystemTheme: true,
  previousBookDirectory: '',
  rootDirectories: [],
  libraryView: LibraryView.LIST,
  customColors: null,
  useCustomColors: false,
};


const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    setSettings: (state, { payload }) => {
      return {
        ...state,
        ...payload
      };
    },
    changeLibraryView: (state, { payload }) => {
      return {
        ...state,
        ...payload
      };
    },
    setTheme: (state, { payload }: PayloadAction<string>) => {
      state.theme = payload;
    },
    setUseSystemTheme: (state, { payload }: PayloadAction<boolean>) => {
      state.useSystemTheme = payload;
    },
    setCustomColors: (state, { payload }: PayloadAction<CustomThemeColors | null>) => {
      state.customColors = payload;
    },
    setUseCustomColors: (state, { payload }: PayloadAction<boolean>) => {
      state.useCustomColors = payload;
    },
    resetSettings: () => {
      return initialState;
    }
  }
});

export const { setSettings, resetSettings, changeLibraryView, setTheme, setUseSystemTheme, setCustomColors, setUseCustomColors } = settingsSlice.actions;
export default settingsSlice.reducer;
