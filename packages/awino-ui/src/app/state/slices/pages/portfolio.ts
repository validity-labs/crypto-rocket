import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { Address, PaginatedState, PaginationParams } from '@/types/app';

import { fetchPortfolioPoolPairs } from '../../actions/pages/portfolio';

interface PaginatedPoolPairs extends Omit<PaginatedState<Address>, 'params'> {
  farmsParams: PaginationParams & { more: boolean };
  liquidityParams: PaginationParams & { more: boolean };
}

interface PagePortfolioState {
  poolPairs: PaginatedPoolPairs;
}

const initialState: PagePortfolioState = {
  poolPairs: {
    ids: [],
    loading: false,
    more: true,
    touched: false,
    farmsParams: {
      more: true,
      size: PAGINATION_PAGE_SIZE,
      cursor: 0,
    },
    liquidityParams: {
      more: true,
      size: PAGINATION_PAGE_SIZE,
      cursor: 0,
    },
  },
};

export const pagePortfolioSlice = createSlice({
  name: 'page-portfolio',
  initialState,
  reducers: {
    changeCursorByTypeForPoolPairs: (state, action: PayloadAction<{ length: number; type: 'farms' | 'liquidity' }>) => {
      const { length, type } = action.payload;
      state.poolPairs[`${type}Params`].cursor += length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolioPoolPairs.pending, (state) => {
        state.poolPairs.loading = true;
      })
      .addCase(
        fetchPortfolioPoolPairs.fulfilled,
        (state, action: PayloadAction<{ ids: Address[]; more: { farms: boolean; liquidity: boolean } }>) => {
          const {
            ids,
            more: { farms, liquidity },
          } = action.payload;
          Object.assign(state.poolPairs, {
            ids: [...state.poolPairs.ids, ...ids],
            touched: true,
            loading: false,
            more: farms || liquidity,
            farmsParams: {
              ...state.poolPairs.farmsParams,
              more: farms,
            },
            liquidityParams: {
              ...state.poolPairs.liquidityParams,
              more: liquidity,
            },
          });
        }
      )
      .addCase(fetchPortfolioPoolPairs.rejected, (state) => {
        state.poolPairs.loading = false;
      });
  },
});

export const { changeCursorByTypeForPoolPairs } = pagePortfolioSlice.actions;

export default pagePortfolioSlice.reducer;
