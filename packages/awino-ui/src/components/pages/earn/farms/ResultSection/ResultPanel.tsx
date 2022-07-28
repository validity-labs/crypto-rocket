import { useCallback, useMemo, useState } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import clsx from 'clsx';

import { Box, Button, Collapse, Container, LinearProgress, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SYMBOLS } from '@/app/constants';
import { useAppSelector } from '@/app/hooks';
import ConnectButton from '@/components/buttons/ConnectButton';
import AssetIcons from '@/components/general/AssetIcons/AssetIcons';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Link from '@/components/general/Link/Link';
import ExpandIcon from '@/components/icons/ExpandIcon';
import InfoIcon from '@/components/icons/InfoIcon';
import LinkIcon from '@/components/icons/LinkIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent, formatMultiplier, formatUSD } from '@/lib/formatters';
import { blockchainExplorerUrl, stopPropagation } from '@/lib/helpers';

import { FarmItem } from './ResultSection';

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  minWidth: '100%',
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(6),
  boxShadow: '0px 3px 6px #00000029',
  backgroundColor: theme.palette.background.transparent,
  cursor: 'pointer',
  overflow: 'hidden',
  '.AwiResultPanel-content': {
    display: 'flex',
    flexDirection: 'row',
    minWidth: '100%',
    padding: theme.spacing(5, 8, 4),
    borderRadius: theme.spacing(6),
    backgroundColor: theme.palette.background.transparent,
    '&.Awi-extended': {
      backgroundColor: 'rgba(0, 255, 235, 0.1)',
    },
    '>div': {
      display: 'flex',
      alignItems: 'center',
    },
    '>div:first-of-type': {
      minWidth: 80,
    },
    '>div:not(:first-of-type)': {
      flex: 1,
      minWidth: 180,
      p: {
        fontWeight: 500,
        color: theme.palette.text.primary,
      },
    },
  },
  '.AwiResultPanel-valueHighlighted': {
    display: 'inline-block',
    padding: theme.spacing(1, 5, 0),
    borderRadius: +theme.shape.borderRadius,
    backgroundColor: '#092937',
    color: theme.palette.text.active,
  },
  '.AwiResultPanel-details': {
    padding: theme.spacing(4, 0, 0),
    marginTop: theme.spacing(8.5),
  },
  '.AwiResultPanel-tooltip svg': {
    fontSize: '14px',
  },
  '.AwiLabelValue-root': {
    padding: theme.spacing(4.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
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
  },
  '.AwiResultPanel-harvest': {
    '.AwiLabelValue-label': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  '.AwiResultPanel-staked': {
    margin: theme.spacing(0, 0, 4.5, 0),
    border: 0,
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

export default function ResultPanel({ item, onHarvest, onStake, onUnstake }: Props) {
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
    <Root onClick={handleDetailsToggle}>
      {isRefetching && <LinearProgress color="warning" />}
      <div className={clsx('AwiResultPanel-content', { 'Awi-extended': isDetailExpanded })}>
        <div>
          <ExpandIcon fontSize="small" sx={{ transform: `rotate(${isDetailExpanded ? -90 : 0}deg)` }} />
        </div>
        <div>
          {/* @ts-expect-error */}
          <AssetIcons ids={item.pair} size="medium" component="div" />
          <Typography className="AwiResultPanel-pair">{item.label}</Typography>
        </div>
        <div>
          <Typography>{SYMBOLS.AWINO}</Typography>
        </div>
        <div>
          <Typography>{item.multiplier}</Typography>
        </div>
        <div>
          <Typography>{formatUSD(item.totalValueOfLiquidityPoolUSD)}</Typography>
        </div>
        <div>
          <Typography>{formatPercent(item.apr)}</Typography>
        </div>
        <div>
          <Typography>{formatPercent(0)}</Typography>
        </div>
      </div>
      <Collapse in={isDetailExpanded} appear>
        <Container maxWidth="sm">
          <div className="AwiResultPanel-details">
            <LabelValue
              id="aprRange"
              value={
                <Box component="span" display="flex" justifyContent="flex-end" alignItems="center">
                  {`${formatPercent(item.aprRange[0])} - ${formatPercent(item.aprRange[1])}`}
                  <Tooltip
                    className="AwiResultPanel-tooltip"
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
              id="boostFactor"
              value={
                <Typography component="span" className="AwiResultPanel-valueHighlighted">
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
              className="AwiResultPanel-harvest"
              value={
                <Button onClick={stopPropagation(handleHarvest)} disabled={!can.harvest}>
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
              className="AwiResultPanel-staked"
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
            <Box component="div" className="Awi-row" sx={{ gap: 6 }}>
              {connected ? (
                <>
                  <Button variant="outlined" onClick={stopPropagation(handleStake)} disabled={!can.stake}>
                    {t('stake')}
                  </Button>
                  <Button onClick={stopPropagation(handleUnstake)} disabled={!can.unstake}>
                    {t('unstake')}
                  </Button>
                </>
              ) : (
                <ConnectButton />
              )}
            </Box>
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
        </Container>
      </Collapse>
    </Root>
  );
}
