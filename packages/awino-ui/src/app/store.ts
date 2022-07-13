import { createWrapper } from 'next-redux-wrapper';

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import accountReducer from './state/slices/account';
import appReducer from './state/slices/app';
import exchangeReducer from './state/slices/exchange';
import masterchefReducer from './state/slices/masterchef';
import pagePortfolioReducer from './state/slices/pages/portfolio';
import pageSwapReducer from './state/slices/pages/swap';

export const makeStore = () =>
  configureStore({
    reducer: {
      app: appReducer,
      account: accountReducer,
      exchange: exchangeReducer,
      masterchef: masterchefReducer,
      pageSwap: pageSwapReducer,
      pagePortfolio: pagePortfolioReducer,
    },
    // devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

const storeWrapper = createWrapper<AppStore>(makeStore);
export default storeWrapper;
