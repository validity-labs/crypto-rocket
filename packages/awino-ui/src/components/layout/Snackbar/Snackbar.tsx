import React, { useEffect } from 'react';

import { Alert, Slide, SlideProps, Snackbar as MuiSnackbar } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { showMessage } from '@/app/state/slices/app';

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const Snackbar = () => {
  const snackbar = useAppSelector((state) => state.app.snackbar);
  const { message = null, alertProps = {}, permanent = false } = snackbar || {};
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);

  const handleClose = (_event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setTimeout(() => {
      dispatch(showMessage(null));
    }, 100);
  };

  useEffect(() => {
    if (snackbar?.message) {
      setOpen(true);
    }
  }, [snackbar]);

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={permanent ? null : 6000}
      onClose={handleClose}
      TransitionComponent={TransitionUp}
      color="primary"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} variant="filled" {...alertProps}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
