import React, { useCallback } from 'react';

import { useTranslation } from 'next-i18next';

import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Container, Hidden, IconButton, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import { toggleDrawer } from '@/app/state/slices/app';
import ConnectButton from '@/components/buttons/ConnectButton';

import Drawer from '../Drawer/Drawer';
import Logo from '../Logo/Logo';
import MainMenu from '../MainMenu/MainMenu';
import MoreMenu from '../MoreMenu/MoreMenu';
import SettingsMenu from '../SettingsMenu/SettingsMenu';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  '& .logo': {
    lineHeight: 0,
    width: '100%',
    maxWidth: 163,
    img: {
      width: '100%',
    },
  },
  [theme.breakpoints.up('sm')]: {
    '& .logo': {
      maxWidth: 240,
    },
  },
}));

const RightSide = styled('div')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    overflow: 'hidden',
  },
  '> div::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  '> div::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
    borderRadius: '6px',
  },
}));

export default function Header() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const handleDrawerToggle = useCallback(() => dispatch(toggleDrawer()), [dispatch]);

  return (
    <>
      <StyledAppBar>
        <Toolbar>
          <Container sx={{ flex: 1, display: 'flex', alignItems: 'center', px: [8, 8, 8] }}>
            <Logo />
            <RightSide>
              <Box sx={{ overflow: 'auto' }}>
                <Hidden lgDown implementation="css">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MainMenu />
                    <ThemeSwitch />
                    <SettingsMenu />
                    <MoreMenu />
                    {/* {activeAccount && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          pl: 3,
                          borderLeft: `1px solid ${isDark ? 'rgba(24, 37, 44, 0.08)' : 'rgba(255, 255, 255, 0.24)'}`,
                          color: isDark ? 'text.secondary' : 'text.contrastPale',
                        }}
                      >

                        <ShortAddress address={activeAccount} avatar={true} />
                      </Box>
                    )} */}
                    <ConnectButton />
                  </Box>
                </Hidden>

                <Hidden lgUp implementation="css">
                  <IconButton
                    size="medium"
                    aria-label={t('header.toggle-menu')}
                    onClick={handleDrawerToggle}
                    // sx={{ color: isDark ? 'secondary.main' : 'common.white' }}
                  >
                    <MenuIcon fontSize="large" />
                  </IconButton>
                </Hidden>
              </Box>
            </RightSide>
          </Container>
        </Toolbar>
      </StyledAppBar>
      <Drawer
      // toggleConnection={toggleConnection}
      // connectionAddress={activeAccount}
      />
      {/* {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )} */}
    </>
  );
}
