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
// import SettingsMenu from '../SettingsMenu/SettingsMenu';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    '.MuiToolbar-root > .MuiContainer-root': {
      paddingLeft: theme.spacing(25),
      paddingRight: theme.spacing(25),
    },
  },
}));

const RightSide = styled('div')(({ theme }) => ({
  // flexGrow: 1,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    overflow: 'hidden',
  },
  'div::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  'div::-webkit-scrollbar-thumb': {
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
          <Container
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between' /*  px: [8, 8, 8]  */,
            }}
          >
            <Logo />
            <Box sx={{ overflow: 'auto' }}>
              <Hidden lgDown implementation="css">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MainMenu />
                  <ThemeSwitch />
                </Box>
              </Hidden>
            </Box>
            <RightSide>
              <Box sx={{ overflow: 'auto' }}>
                <Hidden lgDown implementation="css">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* <SettingsMenu /> */}
                    <MoreMenu />
                    <ConnectButton />
                  </Box>
                </Hidden>

                <Hidden lgUp implementation="css">
                  <IconButton
                    size="medium"
                    color="primary"
                    aria-label={t('header.toggle-menu')}
                    onClick={handleDrawerToggle}
                  >
                    <MenuIcon fontSize="large" />
                  </IconButton>
                </Hidden>
              </Box>
            </RightSide>
          </Container>
        </Toolbar>
      </StyledAppBar>
      <Drawer />
    </>
  );
}
