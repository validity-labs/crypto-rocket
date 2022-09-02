import React from 'react';

import clsx from 'clsx';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { AssetKey } from '@/types/app';

type SizeType = 'small' | 'medium' | 'large';

interface Props {
  symbol: AssetKey;
  size?: SizeType;
  className?: string;
}

const widthMap: Record<SizeType, number> = {
  small: 24,
  medium: 30,
  large: 50,
};

const AssetIcon = styled(({ symbol, size = 'small', className, ...restOfProps }: Props) => {
  const width = widthMap[size];

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    /* @ts-ignore */
    event.target.src = '/images/assets/default.svg';
  };

  return (
    <Box component="span" className={clsx(`AwiAssetIcon-root`, className)} role="presenation" {...restOfProps}>
      <img
        src={`/images/assets/${symbol.toLowerCase()}.svg`}
        alt=""
        width={width}
        height={width}
        onError={handleError}
      />
    </Box>
  );
})<{ size?: SizeType }>(({ size = 'small', theme }) => ({
  display: 'flex',
  marginRight: theme.spacing(1),
  position: 'relative',
  img: {
    position: 'relative',
    display: 'block',
    width: widthMap[size],
    height: widthMap[size],
  },
}));

export default AssetIcon;
