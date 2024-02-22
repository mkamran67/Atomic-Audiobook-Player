import { createSlice } from '@reduxjs/toolkit'
import { SettingsStructureType } from '../../../../shared/types'

const initialState: SettingsStructureType = {
  volume: 100,
  themeMode: 'system',
  previoousBookDirectory: '',
  rootDirectories: []
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
    }
  }
})

export const { setSettings } = settingsSlice.actions
export default settingsSlice.reducer
