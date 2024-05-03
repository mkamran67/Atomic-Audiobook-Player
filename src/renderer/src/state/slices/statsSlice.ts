import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookStatStructure } from '../../../../shared/types';

interface StatsState {
  stats: BookStatStructure[];
}

interface AddStatsPayload {
  bookStats: BookStatStructure[];
}


const initialState: StatsState = {
  stats: []
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStats: (state, { payload }: PayloadAction<AddStatsPayload>) => {
      const newState = {
        stats: payload.bookStats
      };
      return newState;
    },
  }
});

export const { setStats } = statsSlice.actions;

export default statsSlice.reducer;