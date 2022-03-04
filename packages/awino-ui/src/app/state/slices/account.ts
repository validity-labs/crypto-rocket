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
    },
  },
});

export const { setActiveAccount } = accountSlice.actions;

export default accountSlice.reducer;
