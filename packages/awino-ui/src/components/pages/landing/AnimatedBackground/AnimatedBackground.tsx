import { useEffect, useRef } from 'react';

import { Box, GlobalStyles, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

import startAnimation from './animation';

const Root = styled('canvas')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  background: [
    '#002433',
    'linear-gradient(180deg, rgba(0,36,51,1) 0%, rgba(2,5,10,1) 50%, rgba(0,47,67,1) 100%) no-repeat',
  ],
  zIndex: -1,
  width: '100%',
  height: '100%',
  // },
  [theme.breakpoints.up('md')]: {},
}));

export const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const isReducedMotion = useMediaQuery('@media (prefers-reduced-motion)', { noSsr: true });

  useEffect(() => {
    if (isReducedMotion || navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
      return;
    }
    const destroy = startAnimation(canvasRef.current);
    return () => {
      destroy();
    };
  }, [isReducedMotion]);

  return (
    <>
      <GlobalStyles styles={{ '#__next': { position: 'relative' } }} />
      <Root id="awiAnimatedBackgroundCanvas" ref={canvasRef}></Root>
    </>
  );
};
