import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { Address, PaginatedState } from '@/types/app';

import { fetchSwapLiquidity } from '../../actions/pages/swap';

interface PageSwapState {
  liquidity: PaginatedState<Address>;
}

const initialState: PageSwapState = {
  liquidity: {
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

export const pageSwapSlice = createSlice({
  name: 'page-swap',
  initialState,
  reducers: {
    changeCursorForUserLiquidityPairs: (state, action: PayloadAction<number>) => {
      state.liquidity.params.cursor += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSwapLiquidity.pending, (state) => {
        state.liquidity.loading = true;
      })
      .addCase(fetchSwapLiquidity.fulfilled, (state, action) => {
        const { ids, more } = action.payload;
        Object.assign(state.liquidity, {
          ids: [...state.liquidity.ids, ...ids],
          touched: true,
          loading: false,
          more,
        });
      })
      .addCase(fetchSwapLiquidity.rejected, (state) => {
        state.liquidity.loading = false;
      });
  },
});

export const { changeCursorForUserLiquidityPairs } = pageSwapSlice.actions;

export default pageSwapSlice.reducer;
