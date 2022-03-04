import React, { useCallback } from 'react';

import { useTranslation } from 'next-i18next';

import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleTheme } from '@/app/state/slices/app';

const ThemeSwitch = () => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.app.isDark);

  const handleClick = useCallback(() => {
    dispatch(toggleTheme());
    // closeDrawer();
  }, [dispatch]);

  return (
    <IconButton size="small" onClick={handleClick} sx={{ ml: 7.5, mr: 4 }}>
      {isDark ? (
        <LightMode titleAccess={t('common.theme-to-light')} />
      ) : (
        <DarkMode titleAccess={t('common.theme-to-dark')} />
      )}
    </IconButton>
  );
};

export default ThemeSwitch;
