import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomThemeColors, LibraryView, SettingsStructureType } from '../../../../shared/types';

const initialState: SettingsStructureType = {
  volume: 100,
  themeMode: 'system',
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
    setThemeMode: (state, { payload }: PayloadAction<'dark' | 'light' | 'system'>) => {
      state.themeMode = payload;
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

export const { setSettings, resetSettings, changeLibraryView, setThemeMode, setCustomColors, setUseCustomColors } = settingsSlice.actions;
export default settingsSlice.reducer;
