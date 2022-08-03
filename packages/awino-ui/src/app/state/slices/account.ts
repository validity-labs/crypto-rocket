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
      const account = action.payload === null ? null : action.payload;
      state.walletAddress = account;
      state.connected = !!account;

      const previousAccount = localStorage.getItem('account');
      // if new valid account does not match previous account clear local storage and set account key to new account
      if (typeof account !== 'undefined' && account !== previousAccount) {
        localStorage.clear();
        localStorage.setItem('account', account);
      }
    },
  },
  extraReducers: {
    ['RESET']: () => initialState,
  },
});

export const { setAccount } = accountSlice.actions;

export default accountSlice.reducer;
