import { useCallback, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { Box, Button, Collapse, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SYMBOLS } from '@/app/constants';
import { useAppSelector } from '@/app/hooks';
import ConnectButton from '@/components/buttons/ConnectButton';
import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Link from '@/components/general/Link/Link';
import ExpandIcon from '@/components/icons/ExpandIcon';
import InfoIcon from '@/components/icons/InfoIcon';
import LinkIcon from '@/components/icons/LinkIcon';
import AssetIcons from '@/components/pages/swap/SwapSection/AssetIcons';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatLPPair, formatNumber, formatPercent, formatUSD } from '@/lib/formatters';
import { AssetKeyPair } from '@/types/app';

import { FarmDataItem } from './ResultSection';

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(8.5, 8, 7),
  borderRadius: theme.spacing(6),
  boxShadow: '0px 3px 6px #00000029',
  backgroundColor: theme.palette.background.transparent,
  '.AwiResultCard-header': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(0, 0, 9),
  },
  '.AwiResultCard-title': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  '.AwiResultCard-pair': {
    alignSelf: 'flex-start',
    margin: theme.spacing(0, 0, 2.5),
    fontWeight: 600,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
  },
  '.AwiResultCard-proportion': {
    // margin: theme.spacing(0, 0, 2.5),
    // fontWeight: 600,
    // color: theme.palette.text.primary,
    // textTransform: 'uppercase',
    '.AwiLabel-help svg': {
      fontSize: '22px',
    },
  },
  '.AwiResultCard-valueHighlighted': {
    display: 'inline-block',
    padding: theme.spacing(1, 5, 0),
    borderRadius: +theme.shape.borderRadius,
    backgroundColor: '#092937',
    color: theme.palette.text.active,
  },
  '.AwiLabelValue-root': {
    padding: theme.spacing(4.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '.AwiResultCard-details': {
    padding: theme.spacing(4, 0, 0),
  },
  '.AwiResultCard-tooltip svg': {
    fontSize: '14px',
  },
  '.AwiLabelValue-label': {
    margin: theme.spacing(0, 4, 0, 0),
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  '.AwiLabelValue-value': {
    flex: 'auto',
    ...theme.typography.body,
    fontWeight: 500,
    textAlign: 'right',
  },
  '.AwiResultCard-harvest': {
    border: 0,
    margin: theme.spacing(0, 0, 4.5, 0),
    '.AwiLabelValue-label': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  '.AwiResultCard-actions': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  [theme.breakpoints.up('sm')]: {
    '.AwiLabelValue-root': {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
  [theme.breakpoints.up('md')]: {},
}));

interface Props {
  item: FarmDataItem;
  onHarvest: (pair: AssetKeyPair) => void;
  onApprove: (pair: AssetKeyPair) => void;
}

export default function ResultCard({ item, onHarvest, onApprove }: Props) {
  const t = usePageTranslation({ keyPrefix: 'result-section' });
  const { t: tRaw } = useTranslation();
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const handleDetailsToggle = useCallback(
    () => setIsDetailExpanded((prevIsDetailExpanded) => !prevIsDetailExpanded),
    []
  );

  const handleHarvest = useCallback(() => {
    onHarvest(item.pair);
  }, [item, onHarvest]);

  const handleApprove = useCallback(() => {
    onApprove(item.pair);
  }, [item, onApprove]);

  const { connected } = useAppSelector((state) => state.account);

  return (
    <Root className="AwiResultCard-card">
      <div className="AwiResultCard-header">
        {/* @ts-expect-error */}
        <AssetIcons ids={item.pair} size="large" component="div" sx={{ display: 'inline-block' }} />
        <div className="AwiResultCard-title">
          <Typography className="AwiResultCard-pair">{formatLPPair(item.pair)}</Typography>
          <Label
            variant="body-xs"
            tooltip={t('proportion-hint')}
            id="AwiResultCardCardProportion"
            className="AwiResultCard-proportion"
          >
            <Typography component="span" className="AwiResultCard-valueHighlighted">
              {formatPercent(item.proportion)}
            </Typography>
          </Label>
        </div>
      </div>
      <div className="AwiResultCard-content">
        <LabelValue
          id="totalLiquidity"
          value={formatUSD(item.liquidity)}
          labelProps={{ children: t('total-liquidity'), variant: 'body' }}
          valueProps={{ color: 'text.active' }}
        />
        <LabelValue
          id="aprRange"
          value={
            <Box component="span" display="flex" justifyContent="flex-end" alignItems="center">
              {`${formatPercent(item.aprRange[0])} - ${formatPercent(item.aprRange[1])}`}
              <Tooltip
                className="AwiResultCard-tooltip"
                title={t('apr-range-hint', { v1: item.aprFarm, v2: item.aprLP })}
              >
                <Box component="span" ml={2.5} display="flex">
                  <InfoIcon fontSize="small" />
                </Box>
              </Tooltip>
            </Box>
          }
          labelProps={{
            children: t('apr-range'),
            variant: 'body',
          }}
          valueProps={{ color: 'text.active' }}
        />
        <LabelValue
          id="apr"
          value={formatPercent(item.apr)}
          labelProps={{ children: t('apr'), variant: 'body' }}
          valueProps={{ color: 'text.active' }}
        />
        <LabelValue
          id="earn"
          value={SYMBOLS.AWINO}
          labelProps={{ children: t('earn'), variant: 'body' }}
          valueProps={{ color: 'text.primary' }}
        />
        <LabelValue
          id="depositFee"
          value={formatPercent(item.depositFee)}
          labelProps={{ children: t('deposit-fee'), variant: 'body' }}
          valueProps={{ color: 'text.secondary' }}
        />
        <LabelValue
          id="boostFactor"
          value={
            <Typography component="span" className="AwiResultCard-valueHighlighted">
              {formatPercent(item.boostFactor)}
            </Typography>
          }
          labelProps={{
            children: t('your-boost-factor'),
            tooltip: t('your-boost-factor-hint'),
            variant: 'body',
          }}
          valueProps={{ color: 'text.secondary' }}
        />
        <LabelValue
          id="earned"
          className="AwiResultCard-harvest"
          value={
            <Button onClick={handleHarvest} disabled>
              {t('harvest')}
            </Button>
          }
          labelProps={{
            children: (
              <>
                <Typography variant="body" component="span" color="text.primary" sx={{ display: 'block' }}>
                  {t('earned')}
                </Typography>
                <Typography variant="body-lg" component="span">
                  {formatNumber(item.earned)}
                </Typography>
              </>
            ),
            variant: 'body',
          }}
        />
        <div className="AwiResultCard-actions">
          <div>
            <Typography className="AwiResultCard-pair">{formatLPPair(item.pair)}</Typography>
            {connected ? <Button onClick={handleApprove}>{t('approve')}</Button> : <ConnectButton />}
          </div>

          <Button variant="text" size="small" onClick={handleDetailsToggle}>
            {t('details')}{' '}
            {<ExpandIcon fontSize="small" sx={{ transform: `rotate(${isDetailExpanded ? 180 : 0}deg)` }} />}
          </Button>
        </div>
      </div>
      <Collapse in={isDetailExpanded}>
        <div className="AwiResultCard-details">
          <LabelValue
            id="stake"
            value={
              <Box component="span" display="flex" justifyContent="flex-end" alignItems="center">
                <Typography component="span" color="inherit">
                  {formatLPPair(item.pair)}
                </Typography>
                <Link href="/todo" ml={2}>
                  <LinkIcon />
                </Link>
              </Box>
            }
            labelProps={{ children: t('stake'), variant: 'body', color: 'text.secondary' }}
            valueProps={{ color: 'text.primary' }}
          />
          <LabelValue
            id="lpPrice"
            mb={4.5}
            value={`~${formatUSD(item.lpPrice)}`}
            labelProps={{ children: t('lp-price'), variant: 'body', color: 'text.secondary' }}
            valueProps={{ color: 'text.primary' }}
          />
          <Link href="/todo">{t('view-on-scan')}</Link>
        </div>
      </Collapse>
    </Root>
  );
}
