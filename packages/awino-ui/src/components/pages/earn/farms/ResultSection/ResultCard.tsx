import { useCallback, useMemo, useState } from 'react';

import { createSelector } from '@reduxjs/toolkit';

import { Box, Button, Collapse, LinearProgress, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SYMBOLS } from '@/app/constants';
import { useAppSelector } from '@/app/hooks';
import { useWeb3 } from '@/app/providers/Web3Provider';
import ConnectButton from '@/components/buttons/ConnectButton';
import AssetIcons from '@/components/general/AssetIcons/AssetIcons';
import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Link from '@/components/general/Link/Link';
import ExpandIcon from '@/components/icons/ExpandIcon';
import InfoIcon from '@/components/icons/InfoIcon';
import LinkIcon from '@/components/icons/LinkIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent, formatMultiplier, formatUSD } from '@/lib/formatters';
import { blockchainExplorerUrl } from '@/lib/helpers';
import { AssetKeyPair } from '@/types/app';

import { FarmItem } from './ResultSection';

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(8.5, 8, 7),
  borderRadius: theme.spacing(6),
  boxShadow: '0px 3px 6px #00000029',
  backgroundColor: theme.palette.background.transparent,
  overflow: 'hidden',
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
    '.AwiLabelValue-label': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  '.AwiResultCard-staked': {
    margin: theme.spacing(0, 0, 4.5, 0),
    border: 0,
  },
  '.AwiResultCard-actions': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  '.MuiLinearProgress-root': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
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
  item: FarmItem;
  onHarvest: (item: FarmItem) => void;
  onStake: (item: FarmItem) => void;
  onUnstake: (item: FarmItem) => void;
}

const selectRefetchState = (id) =>
  createSelector(
    (state) => state.pageEarnFarms.loading.farmId,
    (farmId) => farmId === id
  );

export default function ResultCard({ item, onHarvest, onStake, onUnstake }: Props) {
  const t = usePageTranslation({ keyPrefix: 'result-section' });

  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const { farmId, can } = item;

  const { refetchStateSelector } = useMemo(() => {
    return {
      refetchStateSelector: selectRefetchState(farmId),
    };
  }, [farmId]);

  const { connected } = useAppSelector((state) => state.account);
  const isRefetching = useAppSelector(refetchStateSelector);

  const handleDetailsToggle = useCallback(
    () => setIsDetailExpanded((prevIsDetailExpanded) => !prevIsDetailExpanded),
    []
  );

  const handleStake = useCallback(() => {
    onStake(item);
  }, [item, onStake]);

  const handleUnstake = useCallback(() => {
    onUnstake(item);
  }, [item, onUnstake]);

  const handleHarvest = useCallback(() => {
    onHarvest(item);
  }, [item, onHarvest]);

  const explorerLink = useMemo(() => blockchainExplorerUrl(item.id), [item.id]);

  return (
    <Root className="AwiResultCard-card">
      {isRefetching && <LinearProgress color="warning" />}
      <div className="AwiResultCard-header">
        {/* @ts-expect-error */}
        <AssetIcons ids={item.pair} size="large" component="div" sx={{ display: 'inline-block' }} />
        <div className="AwiResultCard-title">
          <Typography className="AwiResultCard-pair">{item.label}</Typography>
          <Label
            variant="body-xs"
            tooltip={t('multiplier-hint')}
            id="AwiResultCardCardProportion"
            className="AwiResultCard-proportion"
          >
            <Typography component="span" className="AwiResultCard-valueHighlighted">
              {item.multiplier}
            </Typography>
          </Label>
        </div>
      </div>
      <div className="AwiResultCard-content">
        <LabelValue
          id="totalLiquidity"
          value={formatUSD(item.totalValueOfLiquidityPoolUSD)}
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
          value={formatPercent(0)}
          labelProps={{ children: t('deposit-fee'), variant: 'body' }}
          valueProps={{ color: 'text.secondary' }}
        />
        <LabelValue
          id="boostFactor"
          value={
            <Typography component="span" className="AwiResultCard-valueHighlighted">
              {formatMultiplier(item.boostFactor)}
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
            <Button onClick={handleHarvest} disabled={!can.harvest}>
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
                  {item.rewardFormatted}
                </Typography>
              </>
            ),
            variant: 'body',
          }}
        />
        <LabelValue
          id="staked"
          className="AwiResultCard-staked"
          value={item.stakedFormatted}
          labelProps={{
            children: (
              <>
                <Typography variant="body" component="span" color="text.primary" sx={{ display: 'block' }}>
                  {`${item.label} ${t('staked')}`}
                </Typography>
              </>
            ),
            variant: 'body',
          }}
        />
        <div className="AwiResultCard-actions">
          <div>
            <Box component="div" className="Awi-row" sx={{ gap: 6 }}>
              {connected ? (
                <>
                  <Button variant="outlined" onClick={handleStake} disabled={!can.stake}>
                    {t('stake')}
                  </Button>
                  <Button onClick={handleUnstake} disabled={!can.unstake}>
                    {t('unstake')}
                  </Button>
                </>
              ) : (
                <ConnectButton />
              )}
            </Box>
          </div>

          <Button variant="text" size="small" onClick={handleDetailsToggle}>
            {t('details')}
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
                  {item.label}
                </Typography>
                <Link href={explorerLink} ml={2}>
                  <LinkIcon />
                </Link>
              </Box>
            }
            labelProps={{ children: t('stake'), variant: 'body', color: 'text.secondary' }}
            valueProps={{ color: 'text.primary' }}
          />
          <LabelValue
            id="lpTokenValueUSD"
            mb={4.5}
            value={`~${formatUSD(item.lpTokenValueUSD)}`}
            labelProps={{ children: t('lp-price'), variant: 'body', color: 'text.secondary' }}
            valueProps={{ color: 'text.primary' }}
          />
          {/* <Link href="/todo">{t('view-on-scan')}</Link> */}
        </div>
      </Collapse>
    </Root>
  );
}
