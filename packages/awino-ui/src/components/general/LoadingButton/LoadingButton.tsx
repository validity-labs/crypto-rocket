import React from 'react';

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
interface Props extends ButtonProps {
  loading?: boolean;
  done?: boolean;
  once?: boolean;
  disabled?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, Props>(function LoadingButtonInner(
  { disabled = false, loading = false, done = false, once = false, children, ...restOfProps },
  ref
) {
  return (
    <Button
      ref={ref}
      {...restOfProps}
      disabled={disabled || loading || (once && done)}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      {!loading && done && <CheckCircleOutlineRoundedIcon color="success" /* fontSize={18}  */ sx={{ mr: 3 }} />}
      {loading && <CircularProgress size={18} sx={{ mr: 3 }} />}
      {children}
    </Button>
  );
});

export default LoadingButton;
