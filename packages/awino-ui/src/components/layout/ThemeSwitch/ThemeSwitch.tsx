import React, { useCallback } from 'react';

import { useTranslation } from 'next-i18next';

import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleTheme } from '@/app/state/slices/app';
import DarkMode from '@/components/icons/MoonIcon';
import LightMode from '@/components/icons/SunIcon';

const Root = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  transition: 'color 200ms ease-in-out',
  '&:hover': {
    color: theme.palette.text.active,
  },
}));

const ThemeSwitch = () => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.app.isDark);

  const handleClick = useCallback(() => {
    dispatch(toggleTheme());
    // closeDrawer();
  }, [dispatch]);

  return (
    <Root size="small" onClick={handleClick} sx={{ ml: 7.5, mr: 4 }}>
      {isDark ? (
        <LightMode fontSize="medium" titleAccess={t('common.theme-to-light')} />
      ) : (
        <DarkMode fontSize="medium" titleAccess={t('common.theme-to-dark')} />
      )}
    </Root>
  );
};

export default ThemeSwitch;
