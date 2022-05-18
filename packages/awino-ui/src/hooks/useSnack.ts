import React, { useMemo } from 'react';

import { AlertColor, AlertProps } from '@mui/material';

import { useAppDispatch } from '@/app/hooks';
import { showMessage } from '@/app/state/slices/app';

const useSnack = () => {
  const dispatch = useAppDispatch();

  const show = useMemo(
    () => (message: React.ReactNode, severity?: AlertColor) =>
      dispatch(showMessage({ message, alertProps: { severity } })),
    [dispatch]
  );

  return show;
};

export default useSnack;
