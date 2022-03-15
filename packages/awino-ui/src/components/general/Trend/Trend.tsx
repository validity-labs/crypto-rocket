import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { TrendingDownRounded, TrendingFlatRounded, TrendingUpRounded } from '@mui/icons-material';
import { Typography, TypographyProps, TypographyTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

export interface TrendProps extends Partial<TypographyProps> {
  value: BigNumber;
  // eslint-disable-next-line no-unused-vars
  formatter: (value: BigNumber) => string;
}

const directionIconMap = {
  down: { icon: TrendingDownRounded, color: 'error.main', symbol: '- ' },
  up: { icon: TrendingUpRounded, color: 'success.main', symbol: '+ ' },
  flat: { icon: TrendingFlatRounded, color: 'info.main', symbol: '= ' },
};

const Trend = styled(({ value, formatter, ...restOfProps }: TrendProps) => {
  const [absValue, { color: directionColor, icon: DirectionIcon, symbol: directionSymbol }] = useMemo(() => {
    let dir = value.gt(0) ? 'up' : value.lt(0) ? 'down' : 'flat';
    return [value.abs(), directionIconMap[dir]];
  }, [value]);

  return (
    <Typography {...restOfProps} sx={{ color: directionColor }}>
      {directionSymbol}
      {formatter(absValue)}
      <DirectionIcon color="inherit" />
    </Typography>
  );
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // marginLeft: theme.spacing(5),
  fontWeight: 500,
  '& .MuiSvgIcon-root': {
    marginLeft: theme.spacing(2),
    fontSize: '20px',
  },
}));

export default Trend as OverridableComponent<TypographyTypeMap<TrendProps, 'span'>>;
