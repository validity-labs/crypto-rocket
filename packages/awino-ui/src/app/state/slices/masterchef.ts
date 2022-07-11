import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// import {} from '@/hooks/subgraphs/masterchef/userUserPools';
import { Address } from '@/types/app';

interface Tmp {}

interface UserFarmsContent {
  ids: string[];
  entities: Record<string, Tmp>;
  loading: boolean;
  more: boolean;
  touched: boolean;
}

interface FarmsContent {
  ids: string[];
  entities: Record<string, Tmp>;
  loading: boolean;
  more: boolean;
  touched: boolean;
}

interface MasterchefState {
  userFarms: FarmsContent;
  farms: FarmsContent;
}

// export interface LiquidityExtendedData {
//   token0: {
//     balance: string;
//     balanceFormatted: string;
//   };
//   token1: {
//     balance: string;
//     balanceFormatted: string;
//   };
//   share: string;
// }

const initialState: MasterchefState = {
  userFarms: {
    ids: [],
    entities: {},
    loading: false,
    more: true,
    touched: false,
  },
  farms: {
    ids: [],
    entities: {},
    loading: false,
    more: true,
    touched: false,
  },
};

export const masterchefSlice = createSlice({
  name: 'masterchef',
  initialState,
  reducers: {
    toggleUserFarmsLoad: (state, action: PayloadAction<boolean>) => {
      state.userFarms.loading = action.payload;
    },
    addUserFarms: (state, action: PayloadAction<{ items: any[]; more: boolean }>) => {
      const { items, more } = action.payload;

      // const { ids, entities } = items.reduce(
      //   (ar, r) => {
      //     ar.ids.push(r.id);
      //     ar.entities[r.id] = r;

      //     return ar;
      //   },
      //   { ids: [], entities: {} }
      // );

      // state.liquidity = {
      //   ids: [...state.liquidity.ids, ...ids],
      //   entities: {
      //     ...state.liquidity.entities,
      //     ...entities,
      //   },
      //   touched: true,
      //   loading: false,
      //   more,
      // };
    },
    // extendLiquidity: (state, action: PayloadAction<{ id: Address; data: LiquidityExtendedData }>) => {
    //   const {
    //     id,
    //     data: { share, token0, token1 },
    //   } = action.payload;

    //   const entity = state.liquidity.entities[id];

    //   state.liquidity.entities[id] = {
    //     ...entity,
    //     extended: true,
    //     token0: {
    //       ...entity.token0,
    //       ...token0,
    //     },
    //     token1: {
    //       ...entity.token1,
    //       ...token1,
    //     },
    //     share,
    //   } as LiquidityExtended;
    // },
    // removeLiquidity: (state, action: PayloadAction<string>) => {
    //   const id = action.payload;
    //   state.liquidity.ids = state.liquidity.ids.filter((f) => f !== id);
    //   delete state.liquidity.entities[id];
    // },
  },
});

export const { toggleUserFarmsLoad, addUserFarms } = masterchefSlice.actions;

export default masterchefSlice.reducer;
