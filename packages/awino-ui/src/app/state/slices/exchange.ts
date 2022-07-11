import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { LiquidityPair, LiquidityExtended } from '@/hooks/subgraphs/exchange/useUserLiquidityPairs';
import { Address } from '@/types/app';

interface LiquidityContent {
  ids: Address[];
  entities: Record<Address, LiquidityPair>;
  loading: boolean;
  more: boolean;
  touched: boolean;
}

interface ExchangeState {
  liquidity: LiquidityContent;
}

export interface LiquidityExtendedData {
  // token0: {
  //   reserve: string;
  //   // balance: string;
  //   // balanceFormatted: string;
  // };
  // token1: {
  //   reserve: string;
  //   // balance: string;
  //   // balanceFormatted: string;
  // };
  share: string;
}

const initialState: ExchangeState = {
  liquidity: {
    ids: [],
    entities: {},
    loading: false,
    more: true,
    touched: false,
  },
};

export const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    toggleLiquidityLoad: (state, action: PayloadAction<boolean>) => {
      state.liquidity.loading = action.payload;
    },
    addLiquidity: (state, action: PayloadAction<{ items: LiquidityPair[]; more: boolean }>) => {
      const { items, more } = action.payload;
      console.log(items);
      const { ids, entities } = items.reduce(
        (ar, r) => {
          ar.ids.push(r.id);
          ar.entities[r.id] = r;

          return ar;
        },
        { ids: [], entities: {} }
      );

      state.liquidity = {
        ids: [...state.liquidity.ids, ...ids],
        entities: {
          ...state.liquidity.entities,
          ...entities,
        },
        touched: true,
        loading: false,
        more,
      };
    },
    // setLiquidity: (state, action: PayloadAction<Liquidity[]>) => {
    //   const items = action.payload;

    //   const { ids, entities } = items.reduce(
    //     (ar, r) => {
    //       ar.ids.push(r.id);
    //       ar.entities[r.id] = r;

    //       return ar;
    //     },
    //     { ids: [], entities: {} }
    //   );

    //   state.liquidity = {
    //     ids,
    //     entities,
    //     loading: false,
    //   };
    // },
    extendLiquidity: (state, action: PayloadAction<{ id: Address; data: LiquidityExtendedData }>) => {
      const {
        id,
        data: { share /* , token0, token1 */ },
      } = action.payload;

      const entity = state.liquidity.entities[id];

      state.liquidity.entities[id] = {
        ...entity,
        extended: true,
        // token0: {
        //   ...entity.token0,
        //   ...token0,
        // },
        // token1: {
        //   ...entity.token1,
        //   ...token1,
        // },
        share,
      } as LiquidityExtended;
    },
    removeLiquidity: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.liquidity.ids = state.liquidity.ids.filter((f) => f !== id);
      delete state.liquidity.entities[id];
    },
    resetLiquidity: (state) => {
      state.liquidity = {
        ids: [],
        entities: {},
        loading: false,
        more: true,
        touched: false,
      };
    },
  },
});

export const {
  toggleLiquidityLoad,
  resetLiquidity,
  addLiquidity,
  /* setLiquidity, */ extendLiquidity,
  removeLiquidity,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
