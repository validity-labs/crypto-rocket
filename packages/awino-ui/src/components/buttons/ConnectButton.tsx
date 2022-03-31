import { useCallback, useState } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleConnector } from '@/app/state/slices/app';

import Address from '../general/Address/Address';
import ExitIcon from '../icons/ExitIcon';
import WalletIcon from '../icons/WalletIcon';

const Root = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  minHeight: 50,
  padding: theme.spacing(2, 5),
  border: '2px solid transparent',
  borderRadius: +theme.shape.borderRadius * 2,
  color: '#002D40',
  background: 'linear-gradient(115deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 100%)',
  ...(active && {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: +theme.shape.borderRadius * 2,
    background: theme.palette.mode === 'dark' ? '#002230' : theme.palette.common.white,
    backgroundClip: 'padding-box !important',
    '&:hover': {
      background: theme.palette.mode === 'dark' ? '#002230' : theme.palette.common.white,
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      top: -2,
      right: -2,
      bottom: -2,
      left: -2,
      borderRadius: 'inherit',
      background: 'linear-gradient(115deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 100%)',
      zIndex: -1,
    },
  }),
  '.LabConnectButton-wallet': {
    marginRight: theme.spacing(2.5),
    fontSize: '28px',
    color: theme.palette.text.secondary,
  },
  '.LabConnectButton-exit': {
    marginLeft: theme.spacing(3),
    fontSize: '24px',
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.active,
    // color: theme.palette.text.primary,
  },
  svg: {},
  '.AwiAddress-root': {
    maxWidth: 80,
  },
  '.AwiAddress-address': {
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary,
  },
}));

export default function ConnectButton(props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { connected, walletAddress } = useAppSelector((state) => state.account);

  const handleOpen = useCallback(() => {
    dispatch(toggleConnector(true));
  }, [dispatch]);

  return (
    <>
      <Root active={connected} variant="text" onClick={handleOpen} {...props}>
        {connected ? (
          <>
            <WalletIcon className="LabConnectButton-wallet" />
            <Address address={walletAddress} copy={false} />
            <ExitIcon className="LabConnectButton-exit" />
          </>
        ) : (
          t(`account.connect`)
        )}
      </Root>
    </>
  );
}
