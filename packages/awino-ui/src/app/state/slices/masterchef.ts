import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { merge } from 'lodash';

import { MasterchefMasterchefResponse } from '@/lib/graphql/api/masterchef';
import { Address } from '@/types/app';

import { setAccount } from './account';

export interface Farm {
  id: string;
  pairId: Address;
  isRegular: boolean;
  allocPoint: string;
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

export interface PartialUserFarm {
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

type ID = string;
interface MasterchefState {
  general: MasterchefGeneral | null;
  farms: {
    ids: ID[];
    entities: Record<ID, Farm>;
    pairIdToFarmId: Record<Address, ID>;
    farmIdToPairId: Record<ID, Address>;
  };
  userFarms: {
    entities: Record<ID, PartialUserFarm>;
  };
}

const initialState: MasterchefState = {
  general: null,
  farms: {
    ids: [],
    entities: {},
    pairIdToFarmId: {},
    farmIdToPairId: {},
  },
  userFarms: {
    entities: {},
  },
};

export const masterchefSlice = createSlice({
  name: 'masterchef',
  initialState,
  reducers: {
    addMasterchefs: (state, action: PayloadAction<MasterchefMasterchefResponse[]>) => {
      const items = action.payload;
      if (items.length === 1) {
        state.general = items[0];
      }
    },
    addFarms: (state, action: PayloadAction<Farm[]>) => {
      const items = action.payload;
      state.farms.ids = items.map((r) => {
        state.farms.entities[r.id] = r;
        state.farms.pairIdToFarmId[r.pairId] = r.id;
        state.farms.farmIdToPairId[r.id] = r.pairId;
        return r.id;
      });
    },
    updateFarm: (state, action: PayloadAction<{ id: Address; data: Partial<Omit<Farm, 'id'>> }>) => {
      const { id, data } = action.payload;

      merge(state.farms.entities[id], data);
    },

    addUserFarms: (state, action: PayloadAction<PartialUserFarm[]>) => {
      const items = action.payload;
      items.map((r) => {
        state.userFarms.entities[r.id] = {
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
    updateUserFarm: (state, action: PayloadAction<{ id: Address; data: Partial<Omit<PartialUserFarm, 'id'>> }>) => {
      const { id, data } = action.payload;
      merge(state.userFarms.entities[id], data);
    },
  },
  extraReducers: {
    ['RESET']: () => initialState,
    [setAccount.type]: (state) => {
      state.userFarms.entities = {};
    },
  },
});

export const { addMasterchefs, addFarms, addUserFarms, updateFarm, updateUserFarm } = masterchefSlice.actions;

export default masterchefSlice.reducer;
