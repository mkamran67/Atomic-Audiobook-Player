import { createSlice } from '@reduxjs/toolkit'
import { LibraryView, SettingsStructureType } from '../../../../shared/types'

const initialState: SettingsStructureType = {
  volume: 100,
  themeMode: 'system',
  previousBookDirectory: '',
  rootDirectories: [],
  libraryView: LibraryView.LIST,
}


const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    setSettings: (state, { payload }) => {
      return {
        ...state,
        ...payload
      }
    },
    resetSettings: () => {
      return initialState
    }
  }
})

export const { setSettings, resetSettings } = settingsSlice.actions
export default settingsSlice.reducer
