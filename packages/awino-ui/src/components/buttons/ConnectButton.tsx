import { useCallback, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { Button } from '@mui/material';

import { /* useAppDispatch, */ useAppSelector } from '@/app/hooks';
// import { connect, disconnect } from '@/app/state/slices/account';

import WalletConnect from '../modals/WalletConnect/WalletConnect';

export default function ConnectButton(props) {
  const { t } = useTranslation();
  // const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const { connected } = useAppSelector((state) => ({
    connected: state.account.connected,
  }));

  /* TODO WIP Update when connection logic is defined  */
  const handleOpen = useCallback(() => {
    setOpen(true);
    // if (connected) {
    //   dispatch(disconnect());
    // } else {
    //   dispatch(connect());
    // }
    // console.log('connecting/disconnecting');
  }, [setOpen /* connected, dispatch */]);

  return (
    <>
      <Button color="primary" onClick={handleOpen} {...props}>
        {t(`account.${connected ? 'dis' : ''}connect`)}
      </Button>
      {open && <WalletConnect open={open} setOpen={setOpen} />}
    </>
  );
}
