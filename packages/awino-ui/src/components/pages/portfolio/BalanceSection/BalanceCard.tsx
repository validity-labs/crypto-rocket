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
  // totalColor?: string;
}

const BalanceCard = styled(({ item, /* totalColor, */ className, ...restOfProps }: BalanceCardProps) => {
  const { key, total: value } = item;
  const t = usePageTranslation();
  // const sx = totalColor ? { color: totalColor } : void 0;
  return (
    <Box className={clsx(className, 'AwiBalanceCard-root')} {...restOfProps}>
      <div className="AwiBalanceCard-left">
        <img src={`/images/assets/${key}.svg`} alt="" className="AwiBalanceCard-icon" />
        <div>
          <Typography color="text.primary">{t(`balance-section.assets.${key}.title`)}</Typography>
          <Typography variant="body-sm">{t(`balance-section.assets.${key}.description`)}</Typography>
        </div>
      </div>
      <LabelValue
        id={`balanceCard-${key}`}
        className="AwiBalanceCard-labelValue"
        value={formatAmount(value)}
        // sx={sx}
        labelProps={{
          children: t('balance-section.total-balance'),
        }}
      />
    </Box>
  );
})<BalanceCardProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: theme.spacing(10),
  padding: theme.spacing(6, 0, 5),
  '.AwiBalanceCard-left': {
    display: 'flex',
    flexDirection: 'row',
  },
  '.AwiBalanceCard-icon': {
    position: 'relative',
    top: -4,
    width: 30,
    height: 30,
    marginRight: theme.spacing(3),
  },
  '.AwiBalanceCard-labelValue': {
    flexDirection: 'row',
    margin: '0 0 0 auto',
    '.AwiLabelValue-label, .AwiLabelValue-value': {
      ...theme.typography['body-xs'],
      color: 'inherit',
    },
    '.AwiLabelValue-value': {
      marginRight: theme.spacing(1),
    },
  },
  p: { fontWeight: 500 },
}));

export default BalanceCard as OverridableComponent<BoxTypeMap<BalanceCardProps, 'div'>>;
