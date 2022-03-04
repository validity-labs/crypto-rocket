import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReducer from '../features/counter/counterSlice';

import accountReducer from './state/slices/account';
import appReducer from './state/slices/app';

export function makeStore() {
  return configureStore({
    reducer: { app: appReducer, counter: counterReducer, account: accountReducer },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export default store;
