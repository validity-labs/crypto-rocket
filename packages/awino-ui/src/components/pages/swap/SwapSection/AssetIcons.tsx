import React from 'react';

import clsx from 'clsx';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { AssetKey } from '@/types/app';

type SizeType = 'small' | 'medium' | 'large';

interface Props {
  ids: AssetKey | AssetKey[];
  size: SizeType;
  className?: string;
}

const widthMap: Record<SizeType, number> = {
  small: 24,
  medium: 30,
  large: 50,
};

const AssetIcons = styled(({ ids: assetIds, size, className, ...restOfProps }: Props) => {
  const width = widthMap[size];
  const ids = [].concat(assetIds);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    /* @ts-ignore */
    event.target.src = '/images/assets/default.svg';
  };

  return (
    <Box
      component="span"
      className={clsx(`AwiAssetIcons-root Awi-n${ids.length}`, className)}
      role="presenation"
      {...restOfProps}
    >
      {ids.map((id) => (
        <img
          key={id}
          src={`/images/assets/${id.toLowerCase()}.svg`}
          alt=""
          width={width}
          height={width}
          onError={handleError}
        />
      ))}
    </Box>
  );
})<{ size: SizeType }>(({ size = 'small', theme }) => ({
  display: 'flex',
  marginRight: theme.spacing(1),
  position: 'relative',
  img: {
    position: 'relative',
    display: 'block',
  },
  '&.Awi-n1': {
    // top: -2,
  },
  '&.Awi-n2': {
    ...(size === 'small' && {
      marginRight: theme.spacing(4),
      img: {
        width: 24,
        height: 24,
        '&:nth-of-type(1)': {
          top: -4,
          zIndex: 1,
        },
        '&:nth-of-type(2)': {
          position: 'absolute',
          bottom: -4,
          right: -8,
        },
      },
    }),
    ...(size === 'medium' && {
      marginRight: theme.spacing(6),
      img: {
        width: 30,
        height: 30,
        '&:nth-of-type(1)': {
          top: -2,
          zIndex: 1,
        },
        '&:nth-of-type(2)': {
          position: 'absolute',
          bottom: -2,
          right: -15,
        },
      },
    }),
    ...(size === 'large' && {
      marginRight: theme.spacing(6),
      img: {
        width: widthMap[size],
        height: widthMap[size],
        '&:nth-of-type(1)': {
          top: -5,
          // left: 8,
          zIndex: 1,
        },
        '&:nth-of-type(2)': {
          position: 'absolute',
          bottom: -5,
          right: -25,
        },
      },
    }),
  },
}));

export default AssetIcons;
