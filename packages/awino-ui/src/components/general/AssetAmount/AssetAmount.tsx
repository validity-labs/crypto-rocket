import * as React from 'react';

import { useTranslation } from 'next-i18next';

import BigNumber from 'bignumber.js';
import clsx from 'clsx';

import { Typography, Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { formatAmount } from '@/lib/formatters';
import { AssetKey } from '@/types/app';

type Size = 'small' | 'medium';

const Root = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: Size }>(({ theme, size }) => ({
  display: 'flex',
  flexDirection: 'row',
  '.icon': {
    position: 'relative',

    marginTop: theme.spacing(0.5),
    img: {
      width: size === 'small' ? 24 : 42,
      height: size === 'small' ? 24 : 42,
    },
    '.pair': {
      position: 'absolute',
      transform: 'translateX(-12px)',
    },
  },
  '.values': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    p: {
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
  },
  '.value, .alt': {
    ...theme.typography.body,
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  '.value': {
    padding: theme.spacing(1, 0, 0),
    marginBottom: theme.spacing(0.5),
    fontSize: size === 'small' ? '0.9375rem' /* 15px */ : '1.4375rem' /* 23px */,
  },
  '.alt': {
    fontSize: size === 'small' ? '0.875rem' /* 14px */ : '0.9375rem' /* 15px */,
  },
}));

interface Props extends BoxProps {
  asset: AssetKey;
  value: BigNumber;
  altAsset: AssetKey;
  altValue: BigNumber;
  match?: AssetKey;
  size?: Size;
}

export default function AssetAmount({
  asset,
  value,
  altAsset,
  altValue,
  match,
  size = 'medium',
  ...restOfProps
}: Props) {
  const { t } = useTranslation();
  return (
    <Root size={size} {...restOfProps}>
      <div className="icon">
        <img src={`/images/assets/${asset}.svg`} alt="" className={clsx('source', { pair: match })} />
        {match && <img src={`/images/assets/${match}.svg`} alt="" className="target" />}
      </div>
      <div className="values">
        <Typography className="value">{formatAmount(value, { postfix: t(`common:asset.${asset}`) })}</Typography>
        <Typography className="alt">{formatAmount(altValue, { postfix: t(`common:asset.${altAsset}`) })}</Typography>
      </div>
    </Root>
  );
}
