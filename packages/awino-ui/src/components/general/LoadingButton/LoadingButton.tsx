import React from 'react';

import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface Props extends ButtonProps {
  loading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, Props>(function LoadingButtonInner(
  { loading = false, children, ...restOfProps },
  ref
) {
  return (
    <Button ref={ref} {...restOfProps}>
      {loading && <CircularProgress size={16} sx={{ mr: 2, color: 'text.secondary' }} />}
      {children}
    </Button>
  );
});

export default LoadingButton;
