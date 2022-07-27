import { useState, useCallback, useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';

import { Box, Button, Collapse, Container, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridRow as MuiGridRow, GridRowProps } from '@mui/x-data-grid';
// import { useGridApiContext } from '@mui/x-data-grid';

import { useAppSelector } from '@/app/hooks';
import ConnectButton from '@/components/buttons/ConnectButton';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Link from '@/components/general/Link/Link';
import LinkIcon from '@/components/icons/LinkIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatLPPair, formatMultiplier, formatNumber, formatPercent, formatUSD } from '@/lib/formatters';
import { blockchainExplorerUrl } from '@/lib/helpers';
import { AssetKeyPair } from '@/types/app';

import { FarmItem } from './ResultSection';

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  overflow: 'auto',
  backgroundColor: theme.palette.background.transparent,
  borderRadius: +theme.shape.borderRadius * 6,
  margin: theme.spacing(0, 0, 3),
  // overflow: 'hidden',
  '.AwiResultTable-details': {
    padding: theme.spacing(8.5, 8, 7),
  },
  '.AwiLabelValue-root': {
    padding: theme.spacing(4.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
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
  '.AwiResultTable-valueHighlighted': {
    display: 'inline-block',
    padding: theme.spacing(1, 5, 0),
    borderRadius: +theme.shape.borderRadius,
    backgroundColor: '#092937',
    color: theme.palette.text.active,
  },
  '.AwiResultTable-harvest': {
    '.AwiLabelValue-label': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  '.AwiResultCard-staked': {
    margin: theme.spacing(0, 0, 4.5, 0),
    border: 0,
  },
  '.AwiResultCard-tooltip svg': {
    fontSize: '14px',
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
}));

interface Props {
  onHarvest: (item: FarmItem) => void;
  onStake: (item: FarmItem) => void;
  onUnstake: (item: FarmItem) => void;
}

const selectRefetchState = (id) =>
  createSelector(
    (state) => state.pageEarnFarms.loading.farmId,
    (farmId) => farmId === id
  );

export default function GridRow(props: React.HTMLAttributes<HTMLDivElement> & GridRowProps & Props) {
  const t = usePageTranslation({ keyPrefix: 'result-section' });
  // const apiRef = useGridApiContext();
  // const { setEditCellValue, commitCellChange, setCellMode } = apiRef.current;
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const { onHarvest, onStake, onUnstake, row } = props;
  const { farmId, can } = row;

  const { refetchStateSelector } = useMemo(() => {
    return {
      refetchStateSelector: selectRefetchState(farmId),
    };
  }, [farmId]);

  const isRefetching = useAppSelector(refetchStateSelector);

  const handleDetailsToggle = useCallback(
    () => {
      // const id = props.rowId;
      // const field = 'details';
      // const col = { id, field };
      setIsDetailExpanded((prevIsDetailExpanded) => {
        // setEditCellValue({ ...col, value: !prevIsDetailExpanded });
        // commitCellChange(col);
        // setCellMode(id, field, 'view');
        return !prevIsDetailExpanded;
      });
    },
    [
      /* props, setEditCellValue, commitCellChange, setCellMode */
    ]
  );

  const handleHarvest = useCallback(() => {
    onHarvest(row as FarmItem);
  }, [row, onHarvest]);

  const handleStake = useCallback(() => {
    onStake(row as FarmItem);
  }, [row, onStake]);

  const handleUnstake = useCallback(() => {
    onUnstake(row as FarmItem);
  }, [row, onUnstake]);

  const { connected } = useAppSelector((state) => state.account);

  const explorerLink = useMemo(() => blockchainExplorerUrl(row.id), [row.id]);

  return (
    <Root>
      {isRefetching && <LinearProgress color="warning" />}
      <MuiGridRow component="div" onClick={handleDetailsToggle} {...props} />
      <Collapse in={isDetailExpanded} appear>
        <Container maxWidth="sm">
          <div className="AwiResultTable-details">
            <LabelValue
              id="boostFactor"
              value={
                <Typography component="span" className="AwiResultTable-valueHighlighted">
                  {formatMultiplier(row.boostFactor)}
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
              className="AwiResultTable-harvest"
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
                      {row.rewardFormatted}
                    </Typography>
                  </>
                ),
                variant: 'body',
              }}
            />
            <LabelValue
              id="staked"
              className="AwiResultCard-staked"
              value={row.stakedFormatted}
              labelProps={{
                children: (
                  <>
                    <Typography variant="body" component="span" color="text.primary" sx={{ display: 'block' }}>
                      {`${row.label} ${t('staked')}`}
                    </Typography>
                  </>
                ),
                variant: 'body',
              }}
            />
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
            <LabelValue
              id="stake"
              value={
                <Box component="span" display="flex" justifyContent="flex-end" alignItems="center">
                  <Typography component="span" color="inherit">
                    {formatLPPair(row.pair)}
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
              value={`~${formatUSD(row.lpTokenValueUSD)}`}
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
