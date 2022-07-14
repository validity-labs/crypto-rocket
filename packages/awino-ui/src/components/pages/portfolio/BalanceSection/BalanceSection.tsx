import React, { useEffect } from 'react';

import clsx from 'clsx';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useWeb3 } from '@/app/providers/Web3Provider';
import { fetchPortfolioPoolPairs } from '@/app/state/actions/pages/portfolio';
import Loader from '@/components/general/Loader/Loader';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import { balanceGroupedList } from '@/fixtures/portfolio';
import usePageTranslation from '@/hooks/usePageTranslation';
import { BalanceGrouped } from '@/types/app';

import BalanceCard from './BalanceCard';
import DoughnutChart from './DoughnutChart';
import PoolPairCard from './PoolPairCard';
// @TODO use real data for DoughnutCharts

const Root = styled(Section)(({ theme }) => ({
  '.AwiBalanceSection-title': {
    marginBottom: theme.spacing(10),
  },
  '.AwiBalanceSection-groupTitle': {
    margin: theme.spacing(18.5, 0, 6, 10),
    ...theme.typography.body,
    fontWeight: 500,
    color: theme.palette.text.secondary,
    '&.Awi-first': {
      margin: theme.spacing(0, 0, 6, 10),
    },
  },
  '.AwiBalanceSection-panel > .AwiPanel-content': {
    padding: theme.spacing(12.5, 6.5, 10),
  },
  '.AwiBalanceSection-subPanel': {
    '.AwiPanel-content': { padding: theme.spacing(4, 6.5, 5) },
    '.Awi-divider': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  '.AwiBalanceSection-labelValue': {
    flexDirection: 'row',
    '.label, .value': {
      ...theme.typography['body-xs'],
      lineHeight: '1.5rem' /* 24px match card title */,
      color: theme.palette.text.secondary,
    },
    '.label': {},
  },
  '.AwiBalanceSection-poolPairsLoadMore': {
    margin: theme.spacing(10, 'auto'),
  },
  [theme.breakpoints.up('md')]: {
    '.AwiBalanceSection-panel > .AwiPanel-content': {
      padding: theme.spacing(12.5, 20, 20),
    },
    '.AwiBalanceSection-subPanel': {
      '.AwiPanel-content': { padding: theme.spacing(4, 12, 5, 15) },
    },
  },
}));

const assetColorMap = {
  tokens: ['#C49949', '#9A6400', '#694603'],
  pool: ['#00EC62', '#00F6B1'],
  stableCoins: ['#F5AC37', '#26A17B', '#2775CA'],
};

interface Props {
  items: BalanceGrouped;
  loading: boolean;
}

export default function BalanceSection({ items, loading }: Props) {
  const t = usePageTranslation();
  const { tokens, stableCoins /* , pool */ } = items;
  const { account, library } = useWeb3();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchPortfolioPoolPairs({
        variables: { account },
        provider: library,
        options: { more: false },
      })
    );
  }, [account, dispatch, library]);

  const {
    ids: poolPairIds,
    loading: isPoolPairLoading,
    more: hasMorePoolPairs,
  } = useAppSelector((state) => state.pagePortfolio.poolPairs);

  const handlePoolPairsLoadMore = () => {
    dispatch(fetchPortfolioPoolPairs({ variables: { account }, provider: library }));
  };
  return (
    <Root>
      <Panel className="AwiBalanceSection-panel">
        {loading ? (
          <Loader />
        ) : (
          <Grid container spacing={6.5} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" className="AwiBalanceSection-groupTitle Awi-first">
                {t('balance-section.group-tokens')}
              </Typography>
              <Panel className="AwiBalanceSection-subPanel">
                <Grid container>
                  {tokens.map((item, itemIndex) => (
                    <Grid
                      key={item.key}
                      item
                      xs={12}
                      className={clsx({ 'Awi-divider': itemIndex !== tokens.length - 1 })}
                    >
                      <BalanceCard
                        item={item}
                        totalColor={assetColorMap.tokens[itemIndex % assetColorMap.tokens.length]}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Panel>
            </Grid>
            <Grid item xs={12} md={5}>
              <DoughnutChart data={balanceGroupedList.tokens} i18nKey="tokens" colors={assetColorMap.tokens} />
            </Grid>
            {}
            <Grid item xs={12} md={7}>
              <Typography variant="h2" className="AwiBalanceSection-groupTitle">
                {t('balance-section.group-stable-coins')}
              </Typography>
              <Panel className="AwiBalanceSection-subPanel">
                <Grid container>
                  {stableCoins.map((item, itemIndex) => (
                    <Grid
                      key={item.key}
                      item
                      xs={12}
                      className={clsx({ 'Awi-divider': itemIndex !== tokens.length - 1 })}
                    >
                      <BalanceCard
                        item={item}
                        totalColor={assetColorMap.stableCoins[itemIndex % assetColorMap.stableCoins.length]}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Panel>
            </Grid>
            <Grid item xs={12} md={5}>
              <DoughnutChart
                data={balanceGroupedList.stableCoins}
                i18nKey="stable-coins"
                colors={assetColorMap.stableCoins}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h2" className="AwiBalanceSection-groupTitle">
                {t('balance-section.group-pool')}
              </Typography>
              {/* <Grid container spacing={6.5} alignItems="center"> */}
              {poolPairIds.length > 0 ? (
                <>
                  {/* <Typography variant="body-ms" sx={{ fontWeight: 500, ml: 8, mb: 7 }}>
                      {t('swap-section.liquidity.pool-pair')}
                    </Typography> */}
                  {/* {userFarmsIds.map((farmId) => (
                      <>{farmId}</>
                      // <LiquidityCard
                      //   key={liquidityId}
                      //   item={userLiquidityEntities[liquidityId]}
                      //   onRemove={handleRemoveLiquidityModalToggle}
                      // />
                    ))} */}
                  {poolPairIds.map((poolPairId, itemIndex) => (
                    <PoolPairCard key={poolPairId} id={poolPairId} />
                  ))}
                </>
              ) : (
                <>
                  {!isPoolPairLoading && (
                    <Panel>
                      <Typography mx="auto" textAlign="center">
                        {t('common:common.no-records')}
                      </Typography>
                    </Panel>
                  )}
                </>
              )}
              {hasMorePoolPairs && (
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  loading={isPoolPairLoading}
                  className="AwiBalanceSection-poolPairsLoadMore"
                  onClick={handlePoolPairsLoadMore}
                >
                  {t('common:common.load-more')}
                </LoadingButton>
              )}
              {/* </Grid> */}
            </Grid>
          </Grid>
        )}
      </Panel>
    </Root>
  );
}
