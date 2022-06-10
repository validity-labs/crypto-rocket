import clsx from 'clsx';

import { Box, BoxProps, BoxTypeMap, Typography } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

import LabelValue from '@/components/general/LabelValue/LabelValue';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount } from '@/lib/formatters';
import { BalancePoolInfo } from '@/types/app';

export interface PoolCardProps extends Partial<BoxProps> {
  item: BalancePoolInfo;
}

const PoolCard = styled(({ item, className, ...restOfProps }: PoolCardProps) => {
  const { key, total, staked, assets } = item;
  const t = usePageTranslation();
  return (
    <Box className={clsx(className, 'AwiPoolCard-root')} {...restOfProps}>
      <div className="AwiPoolCard-left">
        <div>
          <Typography color="text.primary">{key.toUpperCase()}</Typography>
          <Typography variant="body-sm" mb={2}>
            {/* {t(`balance-section.assets.${key}.description`)} */}
          </Typography>
          <div className="AwiPoolCard-assets">
            {assets.map((asset, assetIndex) => (
              <img
                key={asset}
                src={`/images/assets/${asset}.svg`}
                alt={t(`balance-section.assets.${asset}.title`)}
                title={t(`balance-section.assets.${asset}.title`)}
                style={{ transform: `translateX(${-1 * assetIndex * 15}px)` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="AwiPoolCard-right">
        <LabelValue
          id={`poolCard-${key}`}
          className="AwiPoolCard-labelValue"
          value={formatAmount(total)}
          sx={{ color: '#00EC62' }}
          labelProps={{
            children: t('balance-section.total-balance'),
          }}
        />
        <LabelValue
          id={`poolCard-${key}`}
          className="AwiPoolCard-labelValue"
          value={formatAmount(staked)}
          sx={{ color: '#00F6B1' }}
          labelProps={{
            children: t('balance-section.staked-balance'),
          }}
        />
      </div>
    </Box>
  );
})<PoolCardProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: theme.spacing(10),
  padding: theme.spacing(6, 0, 5),
  '.AwiPoolCard-left': {
    display: 'flex',
    flexDirection: 'row',
  },
  '.AwiPoolCard-right': {
    margin: '0 0 0 auto',
  },
  '.AwiPoolCard-icon': {
    position: 'relative',
    top: -4,
    width: 30,
    height: 30,
    marginRight: theme.spacing(3),
  },
  '.AwiPoolCard-labelValue': {
    flexDirection: 'row',
    '.AwiLabelValue-label, .AwiLabelValue-value': {
      ...theme.typography['body-xs'],
      color: 'inherit',
      textAlign: 'right',
    },
    '.AwiLabelValue-label': {
      marginRight: theme.spacing(1),
    },
  },
  p: { fontWeight: 500 },
  '.AwiPoolCard-assets': {
    img: {
      width: 30,
      height: 30,
      transition: 'transform 600ms cubic-bezier(0.000, 0.790, 0.400, 0.260)',
    },
    '&:hover': {
      img: {
        transform: `translateX(0px) !important`,
      },
    },
  },
}));

export default PoolCard as OverridableComponent<BoxTypeMap<PoolCardProps, 'div'>>;
