import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Address } from '@/types/app';

export interface FarmPair {
  id: string;
  pairId: Address;
}

export interface PartialUserFarmPair {
  id: string;
  pairId: Address;
  staked: string;
  stakedFormatted: string;
}

interface MasterchefState {
  farmPairs: {
    entities: Record<string, FarmPair>;
    pairIdToFarmId: Record<string, Address>;
  };
  userFarmPairs: {
    entities: Record<string, PartialUserFarmPair>;
  };
}

const initialState: MasterchefState = {
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

export const { addFarmPairs, addUserFarmPairs, updateFarmPair, updateUserFarmPair } = masterchefSlice.actions;

export default masterchefSlice.reducer;
