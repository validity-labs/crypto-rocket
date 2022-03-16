import { createWrapper } from 'next-redux-wrapper';

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import accountReducer from './state/slices/account';
import appReducer from './state/slices/app';

export const makeStore = () =>
  configureStore({
    reducer: { app: appReducer, account: accountReducer },
    // devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

const storeWrapper = createWrapper<AppStore>(makeStore);
export default storeWrapper;
