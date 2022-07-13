import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { Address, PaginatedState, PaginationParams } from '@/types/app';

import { fetchEarnFarmsPoolPairs } from '../../actions/pages/earn-farms';

interface PageEarnFarmsState {
  poolPairs: PaginatedState<Address>;
}

const initialState: PageEarnFarmsState = {
  poolPairs: {
    ids: [],
    loading: false,
    more: true,
    touched: false,
    params: {
      size: PAGINATION_PAGE_SIZE,
      cursor: 0,
    },
  },
};

export const pageEarnFarmsSlice = createSlice({
  name: 'page-earn-farms',
  initialState,
  reducers: {
    changeCursorForPoolPairs: (state, action: PayloadAction<number>) => {
      state.poolPairs.params.cursor += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarnFarmsPoolPairs.pending, (state) => {
        state.poolPairs.loading = true;
      })
      .addCase(fetchEarnFarmsPoolPairs.fulfilled, (state, action: PayloadAction<{ ids: Address[]; more: boolean }>) => {
        const { ids, more } = action.payload;
        Object.assign(state.poolPairs, {
          ids: [...state.poolPairs.ids, ...ids],
          touched: true,
          loading: false,
          more,
          params: {
            ...state.poolPairs.params,
            cursor: state.poolPairs.params.cursor + ids.length,
          },
        });
      })
      .addCase(fetchEarnFarmsPoolPairs.rejected, (state) => {
        state.poolPairs.loading = false;
      });
  },
});

export const { changeCursorForPoolPairs } = pageEarnFarmsSlice.actions;

export default pageEarnFarmsSlice.reducer;
