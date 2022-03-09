import { useCallback } from 'react';

import { useTranslation } from 'next-i18next';

import { Button } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { connect, disconnect } from '@/app/state/slices/account';

export default function ConnectButton(props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { connected } = useAppSelector((state) => ({
    connected: state.account.connected,
  }));

  /* TODO WIP Update when connection logic is defined  */
  const handleConnectToggle = useCallback(() => {
    if (connected) {
      dispatch(disconnect());
    } else {
      dispatch(connect());
    }
    // console.log('connecting/disconnecting');
  }, [connected, dispatch]);

  return (
    <Button color="primary" onClick={handleConnectToggle} {...props}>
      {t(`account.${connected ? 'dis' : ''}connect`)}
    </Button>
  );
}
