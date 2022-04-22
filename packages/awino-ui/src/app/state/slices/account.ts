import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccountState {
  connected: boolean;
  walletAddress: string | null;
}

const initialState: AccountState = {
  walletAddress: null,
  connected: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string | undefined | null>) => {
      state.walletAddress = action.payload === null ? null : action.payload;
      state.connected = !!action.payload;
    },
  },
});

export const { setAccount } = accountSlice.actions;

export default accountSlice.reducer;
