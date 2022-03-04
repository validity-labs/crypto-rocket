import { HYDRATE } from 'next-redux-wrapper';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { isBrowser } from '@/app/constants';
import { I18nPageNamespace, ThemeMode } from '@/types/app';

interface AppState {
  connected: boolean;
  drawer: boolean;
  themeMode: ThemeMode;
  isDark: boolean;
  isLight: boolean;
  awi: number;
  ns: I18nPageNamespace | null;
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
  connected: false,
  drawer: false,
  awi: 1.2932, // TODO WIP When source of this value will be known update fetching logic
  ns: null,
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
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log('HYDRATE', action.payload);
      return {
        ...state,
        ...action.payload.app,
      };
    },
  },
});

// if payload exist set to passed value, otherwise toggle between values
export const { toggleTheme, toggleDrawer, setPageI18nNamespace } = appSlice.actions;

export default appSlice.reducer;
