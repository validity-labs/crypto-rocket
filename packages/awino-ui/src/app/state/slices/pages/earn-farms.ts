import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { merge } from 'lodash';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { ActionVariables, Address, PaginatedState, PaginationParams, PendingAction } from '@/types/app';

import { fetchEarnFarms, refetchCurrentFarms, refetchFarm } from '../../actions/pages/earn-farms';

interface PageEarnFarmsState {
  farms: PaginatedState<Address>;
  loading: {
    farmId: null | Address;
  };
}

const initialState: PageEarnFarmsState = {
  farms: {
    ids: [],
    loading: false,
    more: true,
    touched: false,
    error: false,
    params: {
      size: PAGINATION_PAGE_SIZE,
      cursor: 0,
    },
  },
  loading: {
    farmId: null,
  },
};

export const pageEarnFarmsSlice = createSlice({
  name: 'page-earn-farms',
  initialState,
  reducers: {
    changeCursorForFarms: (state, action: PayloadAction<number>) => {
      state.farms.params.cursor += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('RESET', () => initialState)
      .addCase(fetchEarnFarms.pending, (state) => {
        state.farms.loading = true;
      })
      .addCase(fetchEarnFarms.fulfilled, (state, action: PayloadAction<{ ids: Address[]; more: boolean }>) => {
        const { ids, more } = action.payload;
        merge(state.farms, {
          ids: [...state.farms.ids, ...ids],
          touched: true,
          loading: false,
          more,
          params: {
            ...state.farms.params,
            cursor: state.farms.params.cursor + ids.length,
          },
        });
      })
      .addCase(fetchEarnFarms.rejected, (state) => {
        state.farms.error = true;
        state.farms.loading = false;
        state.farms.more = false;
      })
      .addCase(refetchCurrentFarms.pending, (state) => {
        merge(state.farms, { loading: true });
      })
      .addCase(refetchCurrentFarms.fulfilled, (state) => {
        merge(state.farms, { loading: false });
      })
      .addCase(refetchCurrentFarms.rejected, (state) => {
        merge(state.farms, { loading: false });
      })
      .addCase(refetchFarm.pending, (state, action: PendingAction<ActionVariables<{ id: Address }>>) => {
        state.loading.farmId = action.meta.arg.variables.id;
      })
      .addCase(
        refetchFarm.fulfilled,
        (state, action: PayloadAction<{ id: Address; operation: 'update' | 'remove' }>) => {
          const { id, operation } = action.payload;
          // if (operation === 'remove') {
          //   state.liquidity.ids = state.liquidity.ids.filter((f) => f !== id);
          // }
          state.loading.farmId = null;
        }
      )
      .addCase(refetchFarm.rejected, (state) => {
        state.loading.farmId = null;
      });
  },
});

export const { changeCursorForFarms } = pageEarnFarmsSlice.actions;

export default pageEarnFarmsSlice.reducer;
