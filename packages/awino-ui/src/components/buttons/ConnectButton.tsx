import { useCallback, useState } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import { Button, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleConnector } from '@/app/state/slices/app';

import Address from '../general/Address/Address';
import ExitIcon from '../icons/ExitIcon';
import WalletIcon from '../icons/WalletIcon';

const Root = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  borderRadius: +theme.shape.borderRadius * 2,
  position: 'relative',
  ...theme.typography['body-xs'],
  '.LabConnectButton-content': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    minHeight: 50,
    padding: theme.spacing(2, 5),
    border: '2px solid transparent',
    borderRadius: 'inherit',
    color: '#002D40',
    background: 'linear-gradient(115deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 100%)',
    backgroundClip: 'padding-box !important',
    ...(active && {
      background: '#002230',
      '&:hover': {
        background: '#002230',
      },
    }),
  },
  ...(active && {
    '.LabConnectButton-gradient': {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: 'inherit',
      background: 'linear-gradient(115deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 100%)',
      zIndex: 0,
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
    color: theme.palette.text.primary,
  },
  '.AwiAddress-root': {
    maxWidth: 80,
  },
  '.AwiAddress-address': {
    color: theme.palette.text.primary,
  },
}));

export default function ConnectButton(props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { connected, walletAddress } = useAppSelector((state) => state.account);

  const handleOpen = useCallback(() => {
    dispatch(toggleConnector(true));
  }, [dispatch]);
  // console.log(connected);
  return (
    <>
      <Root active={connected} variant="text" onClick={handleOpen} {...props}>
        {connected ? (
          <>
            <span className="LabConnectButton-gradient" />
            <span className="LabConnectButton-content">
              <WalletIcon className="LabConnectButton-wallet" />
              <Address address={walletAddress} copy={false} />
              <ExitIcon className="LabConnectButton-exit" />
            </span>
          </>
        ) : (
          <span className="LabConnectButton-content">{t(`account.connect`)}</span>
        )}
      </Root>
    </>
  );
}
