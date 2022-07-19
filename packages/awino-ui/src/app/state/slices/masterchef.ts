import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MasterchefMasterchefRaw } from '@/lib/graphql/api/masterchef';
import { Address } from '@/types/app';

export interface FarmPair {
  id: string;
  pairId: Address;
  isRegular?: boolean;
  computations?: {
    apr: string;
    multiplier: string;
    lpTokenValueUSD: string;
    totalValueOfLiquidityPoolUSD: string;
    /* not used */
    token0AmountTotal: string;
    token1AmountTotal: string;
    token1AmountMC: string;
    lpTotalInQuoteToken: string;
  };
}

export interface PartialUserFarmPair {
  id: string;
  pairId: Address;
  staked: string;
  stakedFormatted: string;
  reward: string;
  rewardFormatted: string;
  boostMultiplier: string;
}

export type MasterchefGeneral = {
  address: Address;
  totalRegularAllocPoint: string;
  cakeRateToRegularFarm: string;
};

interface MasterchefState {
  general: MasterchefGeneral | null;
  farmPairs: {
    entities: Record<string, FarmPair>;
    pairIdToFarmId: Record<string, Address>;
  };
  userFarmPairs: {
    entities: Record<string, PartialUserFarmPair>;
  };
}

const initialState: MasterchefState = {
  general: null,
  farmPairs: {
    entities: {},
    pairIdToFarmId: {},
  },
  userFarmPairs: {
    entities: {},
  },
};

export const masterchefSlice = createSlice({
  name: 'masterchef',
  initialState,
  reducers: {
    addMasterchefs: (state, action: PayloadAction<MasterchefMasterchefRaw[]>) => {
      const items = action.payload;
      if (items.length === 1) {
        state.general = items[0];
      }
    },
    addFarmPairs: (state, action: PayloadAction<FarmPair[]>) => {
      const items = action.payload;
      items.map((r) => {
        state.farmPairs.entities[r.id] = r;
        state.farmPairs.pairIdToFarmId[r.pairId] = r.id;
      });
    },
    updateFarmPair: (state, action: PayloadAction<{ id: Address; data: Partial<Omit<FarmPair, 'id'>> }>) => {
      const { id, data } = action.payload;

      Object.assign(state.farmPairs.entities[id], data);
    },

    addUserFarmPairs: (state, action: PayloadAction<PartialUserFarmPair[]>) => {
      const items = action.payload;
      items.map((r) => {
        state.userFarmPairs.entities[r.id] = {
          id: r.id,
          pairId: r.pairId,
          staked: r.staked,
          stakedFormatted: r.stakedFormatted,
          reward: r.reward,
          rewardFormatted: r.rewardFormatted,
          boostMultiplier: r.boostMultiplier,
        };
      });
    },
    updateUserFarmPair: (
      state,
      action: PayloadAction<{ id: Address; data: Partial<Omit<PartialUserFarmPair, 'id'>> }>
    ) => {
      const { id, data } = action.payload;
      Object.assign(state.userFarmPairs.entities[id], data);
    },
  },
});

export const { addMasterchefs, addFarmPairs, addUserFarmPairs, updateFarmPair, updateUserFarmPair } =
  masterchefSlice.actions;

export default masterchefSlice.reducer;
