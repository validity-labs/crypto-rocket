import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { merge } from 'lodash';

import { Address, RecursivePartial } from '@/types/app';

import { fetchBriefLiquidityPairs } from '../actions/exchange';

import { setAccount } from './account';

export interface LiquidityToken {
  id: string;
  symbol: string;
  decimals: string;
  reserve: string;
}

export interface LiquidityPair {
  id: Address;
  token0: LiquidityToken;
  token1: LiquidityToken;
  totalSupply?: string;
}

export interface BriefLiquidityPair {
  id: Address;
  label: string;
  assets: [string, string];
}
export interface PartialUserLiquidityPair {
  id: Address;
  balance: string;
  balanceFormatted: string;
  share: string;
}

export type UserLiquidityPair = LiquidityPair & PartialUserLiquidityPair;

interface ExchangeState {
  liquidityPairs: {
    ids: Address[];
    entities: Record<Address, LiquidityPair>;
    brief: BriefLiquidityPair[];
  };
  userLiquidityPairs: {
    entities: Record<Address, PartialUserLiquidityPair>;
  };
}

const initialState: ExchangeState = {
  liquidityPairs: {
    ids: [],
    entities: {},
    brief: [],
  },
  userLiquidityPairs: {
    entities: {},
  },
};

export const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    addLiquidityPairs: (state, action: PayloadAction<LiquidityPair[]>) => {
      const items = action.payload;
      state.liquidityPairs.ids = items.map((r) => {
        state.liquidityPairs.entities[r.id] = r;
        return r.id;
      });
    },
    updateLiquidityPair: (
      state,
      action: PayloadAction<{ id: Address; data: RecursivePartial<Omit<LiquidityPair, 'id'>> }>
    ) => {
      const { id, data } = action.payload;

      merge(state.liquidityPairs.entities[id], data);
    },

    addUserLiquidityPairs: (state, action: PayloadAction<PartialUserLiquidityPair[]>) => {
      const items = action.payload;
      items.map((r) => {
        state.userLiquidityPairs.entities[r.id] = {
          id: r.id,
          balance: r.balance,
          balanceFormatted: r.balanceFormatted,
          share: r.share,
        };
      });
    },
    updateUserLiquidityPair: (
      state,
      action: PayloadAction<{ id: Address; data: RecursivePartial<Omit<PartialUserLiquidityPair, 'id'>> }>
    ) => {
      const { id, data } = action.payload;
      merge(state.userLiquidityPairs.entities[id], data);
    },
    removeUserLiquidityPair: (state, action: PayloadAction<Address>) => {
      const id = action.payload;
      delete state.userLiquidityPairs.entities[id];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('RESET', () => initialState)
      .addCase(setAccount.type, (state) => {
        state.userLiquidityPairs.entities = {};
      })
      // .addCase(fetchBriefLiquidityPairs.pending, (state) => {
      // })
      .addCase(fetchBriefLiquidityPairs.fulfilled, (state, action: PayloadAction<BriefLiquidityPair[]>) => {
        state.liquidityPairs.brief = action.payload;
      });
    // .addCase(fetchBriefLiquidityPairs.rejected, (state) => {
    // });
  },
});

export const {
  addLiquidityPairs,
  addUserLiquidityPairs,
  updateLiquidityPair,
  updateUserLiquidityPair,
  removeUserLiquidityPair,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
