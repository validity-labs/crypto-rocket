import { useCallback } from 'react';

import { useTranslation } from 'next-i18next';

import { Button } from '@mui/material';

import { useAppSelector } from '@/app/hooks';

export default function ConnectButton(props) {
  const { t } = useTranslation();

  const { connected } = useAppSelector((state) => ({
    connected: state.account.connected,
  }));

  const handleConnectToggle = useCallback(() => {
    console.log('connecting/disconnecting');
  }, []);
  return (
    <Button color="primary" onClick={handleConnectToggle} {...props}>
      {t(`account.${connected ? 'dis' : ''}connect`)}
    </Button>
  );
}
