import { useTranslation } from 'next-i18next';

import { Typography, BoxProps, Box, BoxTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

import { formatGridPercent } from '@/lib/formatters';

interface Props extends Partial<BoxProps> {
  value: number;
}

const APRBadge = styled(({ value, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  return (
    <Box {...restOfProps}>
      <img src="/images/assets/awi.svg" alt="" />
      <Typography>
        {formatGridPercent({ value })}
        <span title={t('common.apr-hint')}>&nbsp;{t('common.apr')}</span>
      </Typography>
    </Box>
  );
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: '100px',
  padding: theme.spacing(0.75, 1, 0.5),
  borderRadius: +theme.shape.borderRadius + 2,
  border: `1px solid ${theme.palette.text.secondary}`,
  ...theme.typography.h7,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  p: {
    ...theme.typography['body-xs'],
    lineHeight: '0.875rem' /* 14px */,
    fontWeight: 500,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
  },
  span: {
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
  },
  img: {
    position: 'relative',
    top: -1,
    display: 'block',
    lineHeight: 0,
    width: 16,
    height: 16,
    marginRight: theme.spacing(1),
  },
}));

export default APRBadge as OverridableComponent<BoxTypeMap<Props, 'div'>>;
