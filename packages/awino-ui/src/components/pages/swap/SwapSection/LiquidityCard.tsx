import { useCallback, useState } from 'react';

import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { Box, Collapse, IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import LabelValue from '@/components/general/LabelValue/LabelValue';
import ExpandIcon from '@/components/icons/ExpandIcon';
import AssetIcons from '@/components/pages/swap/SwapSection/AssetIcons';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount, formatNumber, formatPercent, formatUSD } from '@/lib/formatters';
import { stopPropagation } from '@/lib/helpers';
import { AssetKeyPair } from '@/types/app';

import { LiquidityItem } from './LiquidityPanel';

const Root = styled('div')(({ theme }) => ({
  borderRadius: theme.spacing(8),
  boxShadow: '0px 3px 6px #00000029',
  padding: theme.spacing(0, 8),
  backgroundColor: theme.palette.background.transparent,
  margin: theme.spacing(0, 0, 6),
  '.AwiLiquidityCard-summary': {
    padding: theme.spacing(3.5, 0, 3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  '.AwiLiquidityCard-details': {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3, 0, 8, 3.5),
  },
  '.AwiLiquidityCard-pair': {
    fontWeight: 600,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
  },
  '.AwiLabelValue-root': {
    width: '100%',
    maxWidth: 400,
    gap: theme.spacing(4),
  },
  '.AwiLabelValue-label': {
    flex: 1,
    margin: theme.spacing(0, 4, 0, 0),
    ...theme.typography.body,
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  '.AwiLabelValue-value': {
    flex: 1,
    ...theme.typography.body,
    fontWeight: 500,
    img: {
      marginLeft: theme.spacing(2),
    },
  },
  [theme.breakpoints.up('sm')]: {
    '.AwiLabelValue-root': {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.AwiLiquidityCard-details': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(3, 0, 8, 13.5),
    },
  },
}));

interface Props {
  item: any;
  onRemove: (item: LiquidityItem) => void;
}

export default function LiquidityCard({ item, onRemove /* ,onHarvest, onStake, onUnstake */ }: Props) {
  const t = usePageTranslation({ keyPrefix: 'swap-section.liquidity' });
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const handleDetailsToggle = useCallback(
    () => setIsDetailExpanded((prevIsDetailExpanded) => !prevIsDetailExpanded),
    []
  );

  const handleRemove = () => {
    onRemove(item);
  };

  return (
    <Root>
      <div className="AwiLiquidityCard-summary" onClick={handleDetailsToggle}>
        <div className="Awi-row">
          {/* @ts-expect-error */}
          <AssetIcons ids={item.pair} size="medium" component="div" sx={{ display: 'inline-block' }} />
          <Typography className="AwiLiquidityCard-pair">{`${item.pair[0]}/${item.pair[1]}`}</Typography>
        </div>
        <IconButton color="primary" onClick={stopPropagation(handleDetailsToggle)}>
          {<ExpandIcon fontSize="medium" sx={{ transform: `rotate(${isDetailExpanded ? 180 : 0}deg)` }} />}
        </IconButton>
      </div>
      <Collapse in={isDetailExpanded}>
        <div className="AwiLiquidityCard-details">
          <Box className="Awi-column" sx={{ flex: 1, gap: 5 }}>
            <LabelValue
              id="tokens"
              value={formatAmount(item.tokens)}
              labelProps={{ children: t('your-pool-tokens') }}
            />
            <LabelValue
              id="pooledA"
              value={
                <span className="Awi-row">
                  {formatAmount(item.pool[0])} {<img src={`/images/assets/${item.pair[0]}.svg`} alt="" width="24" />}
                </span>
              }
              labelProps={{ children: t('pooled', { v: item.pair[0].toUpperCase() }) }}
            />
            <LabelValue
              id="pooledB"
              value={
                <span className="Awi-row">
                  {formatAmount(item.pool[1])} <img src={`/images/assets/${item.pair[1]}.svg`} alt="" width="24" />
                </span>
              }
              labelProps={{ children: t('pooled', { v: item.pair[1].toUpperCase() }) }}
            />
            <LabelValue id="poolShare" value={formatPercent(item.percent)} labelProps={{ children: t('pool-share') }} />
          </Box>
          <Box sx={{ alignSelf: 'flex-end' }}>
            <IconButton color="error" title={t('remove-pool')} onClick={stopPropagation(handleRemove)}>
              {<RemoveCircleOutlineRoundedIcon />}
            </IconButton>
          </Box>
        </div>
      </Collapse>
    </Root>
  );
}
