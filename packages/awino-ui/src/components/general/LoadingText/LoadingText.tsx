import React, { memo } from 'react';

import { isEmpty } from 'lodash';

import { styled } from '@mui/material/styles';

interface LoadingTextProps {
  loading: boolean;
  text: string | number | undefined;
}

const LoadingText = styled(({ loading, text, ...restOfProps }: LoadingTextProps) => (
  <>{!loading ? text : <span {...restOfProps} />}</>
))<LoadingTextProps>(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  height: '2px',
  width: '20px',
  verticalAlign: 'middle',
  backgroundColor: theme.palette.divider,
  borderRadius: +theme.shape.borderRadius,
  overflow: 'hidden',
  '&:before': {
    content: '""',
    height: '100%',
    width: '10px',
    backgroundColor: theme.palette.text.active,
    position: 'absolute',
    animation: 'loading 1.5s cubic-bezier(0.76, 0, 0.24, 1) infinite',
  },
  '@keyframes loading': {
    from: {
      transform: 'translateX(-10px)',
    },
    to: {
      transform: 'translateX(20px)',
    },
  },
}));

export default memo(LoadingText);
