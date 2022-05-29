import React, { memo } from 'react';

import { isEmpty } from 'lodash';

import { styled } from '@mui/material/styles';

interface LoadingTextProps {
  loading: boolean;
  text: string | number | undefined;
}

const LoadingText = styled(({ loading, text, ...restOfProps }: LoadingTextProps) => (
  <>
    {!loading ? (
      text
    ) : (
      <span {...restOfProps}>
        <span>{text}</span>
      </span>
    )}
  </>
))<LoadingTextProps>(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  // height: '20px',
  // width: '40px',
  verticalAlign: 'middle',
  backgroundColor: theme.palette.divider,
  borderRadius: +theme.shape.borderRadius * 1.5,
  overflow: 'hidden',
  span: { filter: 'blur(10px)' },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background: [
      theme.palette.background.transparent,
      `linear-gradient(120deg, ${theme.palette.background.transparent} 30%, rgba(225, 225, 225, 0.66) 38%,  ${theme.palette.background.transparent} 48%)`,
    ],
    backgroundSize: '200% 100%',
    backgroundPosition: '100% 0',
    animation: 'loading 2s cubic-bezier(0.76, 0, 0.24, 1) infinite',
  },
  '@keyframes loading': {
    '100%': {
      backgroundPosition: '-100% 0',
    },
    // from: {
    //   transform: 'translateX(-40px)',
    // },
    // to: {
    //   transform: 'translateX(40px)',
    // },
  },
}));

export default memo(LoadingText);
