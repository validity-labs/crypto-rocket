import type { ReactNode } from 'react';
import { useMemo } from 'react';

import Head from 'next/head';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { ThemeMode } from '@/types/app';

import { isBrowser } from '../constants';
import { useAppSelector } from '../hooks';
import themeCreator from '../theme';

const themeMap = new Map();

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const themeMode = useAppSelector((state) => state.app.themeMode);

  const theme = useMemo(() => {
    if (!themeMap.has(themeMode)) {
      themeMap.set(themeMode, themeCreator(themeMode));
    }

    if (isBrowser) {
      (['light', 'dark'] as ThemeMode[]).map((mode) => {
        document.body.classList.toggle(mode, themeMode === mode);
      });
      localStorage.setItem('themeMode', themeMode);
    }

    return themeMap.get(themeMode);
  }, [themeMode]);

  return (
    <>
      <Head>
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </>
  );
};
