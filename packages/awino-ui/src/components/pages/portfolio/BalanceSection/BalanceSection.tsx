import React, { useEffect } from 'react';

import clsx from 'clsx';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useWeb3 } from '@/app/providers/Web3Provider';
import { fetchPortfolioPairs } from '@/app/state/actions/pages/portfolio';
import Loader from '@/components/general/Loader/Loader';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import { balanceGroupedList } from '@/fixtures/portfolio';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatUSD } from '@/lib/formatters';
import { BalanceGrouped } from '@/types/app';

import BalanceCard from './BalanceCard';
import DoughnutChart from './DoughnutChart';
import PairCard from './PairCard';
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
  '.AwiBalanceSection-pairsLoadMore': {
    margin: theme.spacing(10, 'auto'),
  },
  '.AwiBalanceSection-totalValue': {
    display: 'inline-block',
    borderRadius: +theme.shape.borderRadius * 5,
    padding: theme.spacing(7, 6, 6),
    margin: theme.spacing(0, 0, 7),
    backgroundColor: theme.palette.background.transparent,
  },
  [theme.breakpoints.up('md')]: {
    '.AwiBalanceSection-panel > .AwiPanel-content': {
      padding: theme.spacing(12.5, 20, 20),
    },
    '.AwiBalanceSection-subPanel': {
      '.AwiPanel-content': { padding: theme.spacing(4, 12, 5, 15) },
    },
    '.AwiBalanceSection-totalValue': {
      padding: theme.spacing(7, 10, 6),
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
  /* TODO create hook to get total portfolio value */
  const totalPortfolioValue = 93440;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchPortfolioPairs({
        variables: { account },
        provider: library,
        options: { more: false },
      })
    );
  }, [account, dispatch, library]);

  const {
    ids: pairIds,
    loading: pairsLoading,
    more: hasMorePairs,
  } = useAppSelector((state) => state.pagePortfolio.pairs);

  const handlePairsLoadMore = () => {
    dispatch(fetchPortfolioPairs({ variables: { account }, provider: library }));
  };
  return (
    <Root>
      <Panel className="AwiBalanceSection-panel">
        {loading ? (
          <Loader />
        ) : (
          <Grid container spacing={6.5} alignItems="center">
            <Grid item xs={12} textAlign="center">
              <div className="AwiBalanceSection-totalValue">
                <Typography variant="h4" component="h3" fontWeight={600} mb={1} className="Awi-golden">
                  {formatUSD(totalPortfolioValue)}
                </Typography>
                <Typography variant="body-sm" component="h2" fontWeight={500}>
                  {t('balance-section.total-portfolio-value')}
                </Typography>
              </div>
            </Grid>
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
                        // totalColor={assetColorMap.tokens[itemIndex % assetColorMap.tokens.length]}
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
                        // totalColor={assetColorMap.stableCoins[itemIndex % assetColorMap.stableCoins.length]}
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
              {pairIds.length > 0 ? (
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
                  {pairIds.map((pairId, itemIndex) => (
                    <PairCard key={pairId} id={pairId} />
                  ))}
                </>
              ) : (
                <>
                  {!pairsLoading && (
                    <Panel>
                      <Typography mx="auto" textAlign="center">
                        {t('common:common.no-records')}
                      </Typography>
                    </Panel>
                  )}
                </>
              )}
              {hasMorePairs && (
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  loading={pairsLoading}
                  className="AwiBalanceSection-pairsLoadMore"
                  onClick={handlePairsLoadMore}
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
