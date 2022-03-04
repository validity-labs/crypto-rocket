import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccountState {
  connected: boolean;
  activeAccount?: string;
}

const initialState: AccountState = {
  activeAccount: undefined,
  connected: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setActiveAccount: (state, action: PayloadAction<string | undefined | null>) => {
      state.activeAccount = action.payload === null ? undefined : action.payload;
    },
  },
});

export const { setActiveAccount } = accountSlice.actions;

export default accountSlice.reducer;
