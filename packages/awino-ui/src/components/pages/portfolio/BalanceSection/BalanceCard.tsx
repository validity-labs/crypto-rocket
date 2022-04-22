import clsx from 'clsx';

import { Box, BoxProps, BoxTypeMap, Typography } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

import LabelValue from '@/components/general/LabelValue/LabelValue';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount } from '@/lib/formatters';
import { BalanceInfo } from '@/types/app';

export interface BalanceCardProps extends Partial<BoxProps> {
  item: BalanceInfo;
  mode?: 'row' | 'card';
  totalColor?: string;
}

const BalanceCard = styled(
  ({ item, totalColor, className, ...restOfProps }: BalanceCardProps) => {
    const { key, value } = item;
    const t = usePageTranslation();

    return (
      <Box className={clsx(className, 'AwiBalanceCard-root')} {...restOfProps}>
        <div className="AwiBalanceCard-startBox">
          <img src={`/images/assets/${key}.svg`} alt="" className="AwiBalanceCard-icon" />
          <div>
            <Typography color="text.primary" mt={2}>
              {t(`balance-section.assets.${key}.title`)}
            </Typography>
            <Typography variant="body-sm">{t(`balance-section.assets.${key}.description`)}</Typography>
          </div>
        </div>
        <LabelValue
          id={`balanceCard-${key}`}
          className="AwiBalanceCard-labelValue"
          value={formatAmount(value)}
          {...(totalColor
            ? {
                sx: { borderBottom: `2px solid ${totalColor}` },
              }
            : {})}
          labelProps={{
            children: t('balance-section.total-balance'),
          }}
        />
      </Box>
    );
  },
  {
    shouldForwardProp: (prop) => prop !== 'mode',
  }
)<BalanceCardProps>(({ theme, mode = 'card' }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
  gap: theme.spacing(10),

  ...(mode === 'card'
    ? {
        padding: theme.spacing(10.5, 8, 9, 12),
        borderRadius: +theme.shape.borderRadius * 5,
        backgroundColor: theme.palette.background.transparent,
      }
    : {
        padding: theme.spacing(10.5, 0, 9, 0),
        margin: theme.spacing(0, 8, 0, 12),
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),

  '.AwiBalanceCard-startBox': {
    display: 'flex',
    flexDirection: 'row',
  },
  '.AwiBalanceCard-icon': {
    width: 32,
    height: 32,
    marginRight: theme.spacing(5),
  },
  '.AwiBalanceCard-labelValue': {
    flexDirection: 'row',
    '.label, .value': {
      ...theme.typography['body-xs'],
      color: theme.palette.text.secondary,
    },
    '.label': {
      marginRight: theme.spacing(1),
    },
  },
  p: { fontWeight: 500 },
}));

export default BalanceCard as OverridableComponent<BoxTypeMap<BalanceCardProps, 'div'>>;
