import { memo, useEffect, useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { has } from 'lodash';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { ECR20_TOKEN_DECIMALS } from '@/app/constants';
import { useAppSelector } from '@/app/hooks';
import { UserLiquidityPair } from '@/app/state/slices/exchange';
import { PartialUserFarm } from '@/app/state/slices/masterchef';
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
  '.AwiPairCard-left': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  '.AwiPairCard-right': {
    margin: '0 0 0 auto',
  },
  '.AwiPairCard-labelValue': {
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

export interface PairCardProps {
  id: Address;
}

const selectPair = (id) =>
  createSelector(
    (state) => state.exchange.liquidityPairs.entities[id],
    (state) => state.exchange.userLiquidityPairs.entities[id],
    (state) => state.masterchef.farms.pairIdToFarmId[id],
    (state) => state.masterchef.userFarms.entities,
    (liquidityPair, userLiquidityPair, farmId, userFarmsMap) => {
      const { staked = '0', stakedFormatted = '0' } = userFarmsMap[farmId] || {};
      return {
        ...liquidityPair,
        ...userLiquidityPair,
        staked: staked,
        stakedFormatted: stakedFormatted,
      };
    }
  );

const chartColors = ['#00EC62', '#00F6B1'];

type PairItem = UserLiquidityPair & PartialUserFarm;

const PairCard = ({ id }: PairCardProps) => {
  const t = usePageTranslation();
  const itemSelector = useMemo(() => selectPair(id), [id]);
  const item: PairItem = useAppSelector(itemSelector);

  const { token0, token1 } = item;
  const { totalBalanceFormatted, chartData } = useMemo(() => {
    const liquidityBalance = BigNumber.from(item.balance);
    const stakedBalance = BigNumber.from(item.staked);
    const totalBalance = liquidityBalance.add(stakedBalance);

    const totalPercent = liquidityBalance.mul(100).div(totalBalance).toNumber();

    return {
      totalBalanceFormatted: formatUnits(totalBalance, ECR20_TOKEN_DECIMALS),
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
          <div className="AwiPairCard-left">
            <AssetIcons
              ids={[token0.symbol, token1.symbol]}
              size="medium"
              // @ts-expect-error
              component="div"
              sx={{ display: 'inline-block' }}
            />
            <Typography color="text.primary">{`${token0.symbol}/${token1.symbol}`}</Typography>
          </div>
          <div className="AwiPairCard-right">
            <LabelValue
              id={`poolCard-${id}`}
              className="AwiPairCard-labelValue"
              value={totalBalanceFormatted}
              sx={{ color: chartColors[0] }}
              labelProps={{
                children: t('balance-section.total-balance'),
              }}
            />
            <LabelValue
              id={`poolCard-${id}`}
              className="AwiPairCard-labelValue"
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

export default memo(PairCard);
