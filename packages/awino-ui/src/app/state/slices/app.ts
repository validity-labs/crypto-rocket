import React from 'react';

import { HYDRATE } from 'next-redux-wrapper';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AlertProps } from '@mui/material';

import { isBrowser } from '@/app/constants';
import { I18nPageNamespace, ThemeMode } from '@/types/app';

interface SnackbarState {
  message: React.ReactNode;
  alertProps?: Pick<AlertProps, 'severity'>;
}

interface AppState {
  drawer: boolean;
  /* trigger wallet connect modal */
  connector: boolean;
  themeMode: ThemeMode;
  isDark: boolean;
  isLight: boolean;
  awi: number;
  ns: I18nPageNamespace | null;
  snackbar?: SnackbarState | null;

  /*
    on application load wait for:
      - account connection check
  */
  initializing: boolean;
}

type MaybeTheme = ThemeMode | null | undefined;
const initialState: AppState = {
  ...(() => {
    let themeMode: ThemeMode = 'dark';

    let storageThemeMode: MaybeTheme;

    if (isBrowser) {
      storageThemeMode = localStorage.getItem('themeMode') as MaybeTheme;
      if (storageThemeMode) {
        themeMode = storageThemeMode;
      } else {
        const supportMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined';

        if (supportMatchMedia) {
          const prefersDarkMode = window.matchMedia('(prefers-color-scheme:dark)').matches;
          themeMode = prefersDarkMode ? 'dark' : 'light';
        }
      }
    }

    return {
      themeMode,
      isDark: themeMode === 'dark',
      isLight: themeMode === 'light',
    };
  })(),
  connector: false,
  drawer: false,
  awi: 1.2932, // TODO WIP When source of this value will be known update fetching logic
  ns: null,
  initializing: true,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleTheme: (state, action: PayloadAction<ThemeMode | undefined>) => {
      // if payload exist set to passed value, otherwise toggle between values
      const newThemeMode = action.payload ? action.payload : state.themeMode === 'dark' ? 'light' : 'dark';
      state.themeMode = newThemeMode;
      state.isDark = newThemeMode === 'dark';
      state.isLight = newThemeMode === 'light';
    },
    toggleDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      // if payload exist set to passed value, otherwise toggle between values
      state.drawer = action.payload ? action.payload : !state.drawer;
    },
    setPageI18nNamespace: (state, action: PayloadAction<I18nPageNamespace>) => {
      state.ns = action.payload;
    },
    showMessage: (state, action: PayloadAction<SnackbarState | null>) => {
      state.snackbar = action.payload;
    },
    toggleConnector: (state, action: PayloadAction<boolean | undefined>) => {
      // if payload exist set to passed value, otherwise toggle between values
      state.connector = action.payload ? action.payload : !state.connector;
    },
    completeAppInitialization: (state) => {
      state.initializing = false;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.app, // server payload
        initializing: state.initializing, // only client value is tracked
      };
    },
  },
});

// if payload exist set to passed value, otherwise toggle between values
export const {
  toggleTheme,
  toggleDrawer,
  toggleConnector,
  setPageI18nNamespace,
  showMessage,
  completeAppInitialization,
} = appSlice.actions;

export default appSlice.reducer;
