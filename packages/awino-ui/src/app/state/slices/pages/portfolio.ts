import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { merge } from 'lodash';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { Address, PaginatedState, PaginationParams } from '@/types/app';

import { fetchPortfolioPairs } from '../../actions/pages/portfolio';

interface PaginatedPairs extends Omit<PaginatedState<Address>, 'params'> {
  farmsParams: PaginationParams & { more: boolean };
  liquidityParams: PaginationParams & { more: boolean };
}

interface PagePortfolioState {
  pairs: PaginatedPairs;
}

const initialState: PagePortfolioState = {
  pairs: {
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
    changeCursorByTypeForPairs: (state, action: PayloadAction<{ length: number; type: 'farms' | 'liquidity' }>) => {
      const { length, type } = action.payload;
      state.pairs[`${type}Params`].cursor += length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('RESET', () => initialState)
      .addCase(fetchPortfolioPairs.pending, (state) => {
        state.pairs.loading = true;
      })
      .addCase(
        fetchPortfolioPairs.fulfilled,
        (state, action: PayloadAction<{ ids: Address[]; more: { farms: boolean; liquidity: boolean } }>) => {
          const {
            ids,
            more: { farms, liquidity },
          } = action.payload;
          merge(state.pairs, {
            ids: [...state.pairs.ids, ...ids],
            touched: true,
            loading: false,
            more: farms || liquidity,
            farmsParams: {
              ...state.pairs.farmsParams,
              more: farms,
            },
            liquidityParams: {
              ...state.pairs.liquidityParams,
              more: liquidity,
            },
          });
        }
      )
      .addCase(fetchPortfolioPairs.rejected, (state) => {
        state.pairs.loading = false;
      });
  },
});

export const { changeCursorByTypeForPairs } = pagePortfolioSlice.actions;

export default pagePortfolioSlice.reducer;
