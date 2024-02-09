import { createSlice } from '@reduxjs/toolkit'
import { LayoutState } from '../types/layout.types'

// Handles Loading and Error states
let initialState: LayoutState = {
  error: false,
  loading: false,
  message: ''
}

// Read books from settings save location
const layoutSlice = createSlice({
  name: 'layout',
  initialState: initialState,
  reducers: {
    setError: (state, { payload }) => {
      // if state has errors already
      if (state.error) {
        // REVIEW : lookie here
        // TODO : handle error in UI
      }

      return { ...state, ...payload }
    },

    clearError: (state) => {
      return { ...state, error: false, message: '', loading: false }
    },

    setLoading: (state, { payload }) => {
      return {
        ...state,
        loading: payload.loading,
        message: payload.message
      }
    },

    clearLoading: (state) => {
      return {
        ...state,
        loading: false,
        message: ''
      }
    }
  }
})

export const { setError } = layoutSlice.actions

export default layoutSlice.reducer
