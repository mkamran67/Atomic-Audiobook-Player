import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddBookStatPayload, DeleteBookStatPayload, UpdateBookStatPayload } from '../../types/stats.types';
import { statsBooksState } from '../../../../shared/types';

interface StatsState {
  stats: statsBooksState[];
}


const initialState: StatsState = {
  stats: []
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    addBookStats: (state, { payload }: AddBookStatPayload) => {

      const newState = {
        stats: [...state.stats, payload]
      };

      return newState;
    },
    deleteBookFromStats: (state, { payload }: DeleteBookStatPayload) => {
      return {
        stats: state.stats.filter(book => {
          if (book.path === payload.path) {
            return false;
          } else {
            return true;
          }
        })
      };
    },
    updateBookStats: (state, { payload }: UpdateBookStatPayload) => {
      return {
        stats: state.stats.map(bookStats => {
          if (bookStats.path === payload.path) {
            return;
          } else {
            return bookStats;
          }
        })
      };
    }
  },
});

export const { addBookStats, deleteBookFromStats, updateBookStats } = statsSlice.actions;

export default statsSlice.reducer;