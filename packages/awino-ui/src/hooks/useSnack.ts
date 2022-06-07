import React, { useMemo } from 'react';

import { AlertColor, AlertProps } from '@mui/material';

import { useAppDispatch } from '@/app/hooks';
import { showMessage } from '@/app/state/slices/app';

const useSnack = () => {
  const dispatch = useAppDispatch();

  const show = useMemo(
    () => (message: React.ReactNode, severity?: AlertColor, permanent?: boolean) =>
      dispatch(showMessage({ message, alertProps: { severity }, permanent })),
    [dispatch]
  );

  return show;
};

export default useSnack;
