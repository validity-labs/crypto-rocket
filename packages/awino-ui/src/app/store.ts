import { createWrapper } from 'next-redux-wrapper';

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import accountReducer from './state/slices/account';
import appReducer from './state/slices/app';
import exchangeReducer from './state/slices/exchange';
import masterchefReducer from './state/slices/masterchef';
import pageEarnFarmsReducer from './state/slices/pages/earn-farms';
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
      pageEarnFarms: pageEarnFarmsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          /* app/showMessage is of type React.ReactNode therefore needs to be excluded from serialization  */
          // ignoredActions: ['app/showMessage'],
          ignoredActionPaths: ['meta.arg', 'payload.timestamp', 'payload.message'],

          ignoredPaths: ['app.snackbar'],
        },
      }),
    // devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

const storeWrapper = createWrapper<AppStore>(makeStore);
export default storeWrapper;
