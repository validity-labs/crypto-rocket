import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccountState {
  connected: boolean;
  activeAccount: string | null;
}

const initialState: AccountState = {
  activeAccount: null,
  connected: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setActiveAccount: (state, action: PayloadAction<string | undefined | null>) => {
      state.activeAccount = action.payload === null ? null : action.payload;
      state.connected = !!action.payload;
    },
    connect: (state, action?: PayloadAction<string>) => {
      /* TODO WIP Check if account is valid */
      state.activeAccount = action.payload || 'ACTIVE_ACCOUNT';
      state.connected = true;
    },
    disconnect: (state) => {
      state.activeAccount = null;
      state.connected = false;
    },
  },
});

export const { setActiveAccount, connect, disconnect } = accountSlice.actions;

export default accountSlice.reducer;
