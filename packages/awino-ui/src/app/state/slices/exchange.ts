import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Liquidity, LiquidityExtended } from '@/hooks/subgraphs/exchange/useUserMintPairs';
import { Address } from '@/types/app';

interface LiquidityContent {
  ids: Address[];
  entities: Record<Address, Liquidity>;
  loading: boolean;
  // touched: boolean;
}

interface ExchangeState {
  liquidity: LiquidityContent;
}

export interface LiquidityExtendedData {
  token0: {
    balance: string;
    balanceFormatted: string;
  };
  token1: {
    balance: string;
    balanceFormatted: string;
  };
  share: string;
}

const initialState: ExchangeState = {
  liquidity: {
    ids: [],
    entities: {},
    loading: false,
  },
};

export const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    initiateSetLiquidity: (state) => {
      state.liquidity.loading = true;
    },
    setLiquidity: (state, action: PayloadAction<Liquidity[]>) => {
      const items = action.payload;

      const { ids, entities } = items.reduce(
        (ar, r) => {
          ar.ids.push(r.id);
          ar.entities[r.id] = r;

          return ar;
        },
        { ids: [], entities: {} }
      );

      state.liquidity = {
        ids,
        entities,
        loading: false,
      };
    },
    extendLiquidity: (state, action: PayloadAction<{ id: Address; data: LiquidityExtendedData }>) => {
      const {
        id,
        data: { share, token0, token1 },
      } = action.payload;

      const entity = state.liquidity.entities[id];

      state.liquidity.entities[id] = {
        ...entity,
        extended: true,
        token0: {
          ...entity.token0,
          ...token0,
        },
        token1: {
          ...entity.token1,
          ...token1,
        },
        share,
      } as LiquidityExtended;
    },
    removeLiquidity: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.liquidity.ids = state.liquidity.ids.filter((f) => f !== id);
      delete state.liquidity.entities[id];
    },
  },
});

export const { initiateSetLiquidity, setLiquidity, extendLiquidity, removeLiquidity } = exchangeSlice.actions;

export default exchangeSlice.reducer;
