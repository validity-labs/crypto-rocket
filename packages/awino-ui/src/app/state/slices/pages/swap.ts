import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PendingActionFromAsyncThunk } from '@reduxjs/toolkit/dist/matchers';
import { merge } from 'lodash';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { ActionVariables, Address, PaginatedState, PendingAction } from '@/types/app';

import { fetchSwapLiquidity, refetchLiquidityPair } from '../../actions/pages/swap';

interface PageSwapState {
  liquidity: PaginatedState<Address>;
  loading: {
    liquidityId: null | Address;
  };
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
  loading: {
    liquidityId: null,
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
      .addCase('RESET', () => initialState)
      .addCase(fetchSwapLiquidity.pending, (state) => {
        state.liquidity.loading = true;
      })
      .addCase(fetchSwapLiquidity.fulfilled, (state, action) => {
        const { ids, more } = action.payload;
        merge(state.liquidity, {
          ids: [...state.liquidity.ids, ...ids],
          touched: true,
          loading: false,
          more,
        });
      })
      .addCase(fetchSwapLiquidity.rejected, (state) => {
        state.liquidity.loading = false;
      })
      .addCase(refetchLiquidityPair.pending, (state, action: PendingAction<ActionVariables<{ id: Address }>>) => {
        state.loading.liquidityId = action.meta.arg.variables.id;
      })
      .addCase(
        refetchLiquidityPair.fulfilled,
        (state, action: PayloadAction<{ id: Address; operation: 'update' | 'remove' }>) => {
          const { id, operation } = action.payload;
          if (operation === 'remove') {
            state.liquidity.ids = state.liquidity.ids.filter((f) => f !== id);
          }
          state.loading.liquidityId = null;
        }
      )
      .addCase(refetchLiquidityPair.rejected, (state) => {
        state.loading.liquidityId = null;
      });
  },
});

export const { changeCursorForUserLiquidityPairs } = pageSwapSlice.actions;

export default pageSwapSlice.reducer;
