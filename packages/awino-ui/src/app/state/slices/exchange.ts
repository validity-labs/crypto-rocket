import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { merge } from 'lodash';

import { Address, RecursivePartial } from '@/types/app';

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
export interface PartialUserLiquidityPair {
  id: Address;
  balance: string;
  balanceFormatted: string;
  share: string;
}

export type UserLiquidityPair = LiquidityPair & PartialUserLiquidityPair;

interface ExchangeState {
  liquidityPairs: {
    entities: Record<Address, LiquidityPair>;
  };
  userLiquidityPairs: {
    entities: Record<Address, PartialUserLiquidityPair>;
  };
}

const initialState: ExchangeState = {
  liquidityPairs: {
    entities: {},
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
      items.map((r) => {
        state.liquidityPairs.entities[r.id] = r;
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
});

export const {
  addLiquidityPairs,
  addUserLiquidityPairs,
  updateLiquidityPair,
  updateUserLiquidityPair,
  removeUserLiquidityPair,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
