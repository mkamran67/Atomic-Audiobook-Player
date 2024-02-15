import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  volume: 100
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
