import { memo, useEffect, useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { has } from 'lodash';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppSelector } from '@/app/hooks';
import { UserLiquidityPair } from '@/app/state/slices/exchange';
import { PartialUserFarmPair } from '@/app/state/slices/masterchef';
import AssetIcons from '@/components/general/AssetIcons/AssetIcons';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Panel from '@/components/general/Panel/Panel';
import usePageTranslation from '@/hooks/usePageTranslation';
import { Address } from '@/types/app';

import DoughnutChart, { CustomDoughnutChartData } from './DoughnutChart';

const Root = styled(Grid)(({ theme }) => ({
  '.AwiPanel-content': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: theme.spacing(10),
    padding: theme.spacing(10, 6.5, 10),
  },
  '.AwiPoolPairCard-left': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  '.AwiPoolPairCard-right': {
    margin: '0 0 0 auto',
  },
  '.AwiPoolPairCard-labelValue': {
    flexDirection: 'row',
    '.AwiLabelValue-label, .AwiLabelValue-value': {
      ...theme.typography['body-xs'],
      color: 'inherit',
      textAlign: 'right',
    },
    '.AwiLabelValue-label': {
      marginRight: theme.spacing(6.5),
    },
  },
  p: { fontWeight: 500 },
  [theme.breakpoints.up('md')]: {
    '.AwiPanel-content': {
      padding: theme.spacing(10, 12, 10, 15),
    },
  },
}));

export interface PoolPairCardProps {
  id: Address;
}

const selectPoolPair = (id) =>
  createSelector(
    (state) => state.exchange.liquidityPairs.entities[id],
    (state) => state.exchange.userLiquidityPairs.entities[id],
    (state) => state.masterchef.farmPairs.pairIdToFarmId[id],
    (state) => state.masterchef.userFarmPairs.entities,
    (liquidityPair, userLiquidityPair, farmId, userFarmPairs) => {
      const { staked = '0', stakedFormatted = '0' } = userFarmPairs[farmId] || {};
      return {
        ...liquidityPair,
        ...userLiquidityPair,
        staked: staked,
        stakedFormatted: stakedFormatted,
      };
    }
  );

const chartColors = ['#00EC62', '#00F6B1'];

type PoolPairItem = UserLiquidityPair & PartialUserFarmPair;

const PoolPairCard = ({ id }: PoolPairCardProps) => {
  const t = usePageTranslation();

  const itemSelector = useMemo(() => selectPoolPair(id), [id]);
  const item: PoolPairItem = useAppSelector(itemSelector);

  // useEffect(() => {
  //   console.log('PoolPairCard mount');
  // }, []);
  // console.log('PoolPairCard render', id);

  const { token0, token1 } = item;

  const { totalBalanceFormatted, chartData } = useMemo(() => {
    const liquidityBalance = BigNumber.from(item.balance);
    const stakedBalance = BigNumber.from(item.staked);
    const totalBalance = liquidityBalance.add(stakedBalance);

    const totalPercent = liquidityBalance.mul(100).div(totalBalance).toNumber();

    return {
      totalBalanceFormatted: formatUnits(totalBalance, 18),
      chartData: [
        {
          key: 'lp',
          total: totalPercent,
          tooltipValue: item.balanceFormatted,
        },
        {
          key: 'staked',
          total: 100 - totalPercent,
          tooltipValue: item.stakedFormatted,
        },
      ],
    };
  }, [item]);

  return (
    <Root container alignItems="center" spacing={6.5}>
      <Grid item xs={12} md={7}>
        <Panel>
          <div className="AwiPoolPairCard-left">
            <AssetIcons
              ids={[token0.symbol, token1.symbol]}
              size="medium"
              // @ts-expect-error
              component="div"
              sx={{ display: 'inline-block' }}
            />
            <Typography color="text.primary">{`${token0.symbol}/${token1.symbol}`}</Typography>
          </div>
          <div className="AwiPoolPairCard-right">
            <LabelValue
              id={`poolCard-${id}`}
              className="AwiPoolPairCard-labelValue"
              value={totalBalanceFormatted}
              sx={{ color: chartColors[0] }}
              labelProps={{
                children: t('balance-section.total-balance'),
              }}
            />
            <LabelValue
              id={`poolCard-${id}`}
              className="AwiPoolPairCard-labelValue"
              value={item.stakedFormatted}
              sx={{ color: chartColors[1] }}
              labelProps={{
                children: t('balance-section.staked-balance'),
              }}
            />
          </div>
        </Panel>
      </Grid>
      <Grid item xs={12} md={5}>
        <DoughnutChart
          data={chartData}
          i18nKey="pool"
          colors={chartColors}
          customLabel={(context) => {
            const raw = context.raw as CustomDoughnutChartData;
            return `${t(`balance-section.${raw.key}-balance`)}: ${raw.tooltipValue}`;
          }}
        />
      </Grid>
    </Root>
  );
};

export default memo(PoolPairCard);
