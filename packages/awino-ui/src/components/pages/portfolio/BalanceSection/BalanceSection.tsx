import React, { useMemo } from 'react';

import { Doughnut } from 'react-chartjs-2';

import { Chart as ChartJS, ChartData, ArcElement, Tooltip, Legend } from 'chart.js';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import LabelValue from '@/components/general/LabelValue/LabelValue';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount } from '@/lib/formatters';
import { BalanceGrouped } from '@/types/app';

import BalanceCard from './BalanceCard';

const OutlineDoughnut = {
  id: 'outlineDoughnut',
  afterDraw(chart /* , args, options */) {
    const {
      chartArea: { left, top, right, bottom },
      ctx,
    } = chart;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    const r = Math.min(right - left, bottom - top) / 2;

    // draw two circles, inside and outside of a doughnut
    [0.85, 0.5].map((ratio) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.arc(centerX, centerY, r * ratio, 0, 2 * Math.PI);
      ctx.stroke();
    });
  },
};

ChartJS.register(ArcElement, Tooltip, Legend, OutlineDoughnut);

const Root = styled(Section)(({ theme }) => ({
  '.AwiBalanceSection-title': {
    marginBottom: theme.spacing(10),
  },
  '.AwiBalanceSection-groupTitle': {
    ...theme.typography.body,
    fontWeight: 500,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(6),
  },
  '.AwiPanel-root': {
    '.AwiPanel-content': {
      padding: theme.spacing(5.5, 8, 10, 12),
    },
    '&.AwiPanel-wrapper': {
      '.content': {
        padding: theme.spacing(12.5, 6.5, 10),
      },
    },
  },
  '.AwiBalanceSection-labelValue': {
    flexDirection: 'row',
    '.label, .value': {
      ...theme.typography['body-xs'],
      color: theme.palette.text.secondary,
    },
    '.label': {
      marginRight: theme.spacing(1),
    },
  },
  '.AwiBalanceSection-poolGroup': {
    '.AwiPanel-root': {
      alignItems: 'flex-end',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.AwiPanel-root': {
      '&.AwiPanel-wrapper': {
        '.AwiPanel-content': {
          padding: theme.spacing(12.5, 12.5, 10),
        },
      },
    },
  },
}));

interface Props {
  items: BalanceGrouped;
}

const tokenColors = ['#aa82ff', '#8659ff', '#6c31ff'];

export default function BalanceSection({ items }: Props) {
  const t = usePageTranslation();
  const { tokens, stableCoins } = items;

  const chartData = useMemo<ChartData<'doughnut', number[], string>>(
    () => ({
      labels: tokens.slice(0, 3).map(({ key }) => t(`balance-section.assets.${key}.title`)),
      datasets: [
        {
          label: t('balance-section.total-balance'),
          data: tokens.slice(0, 3).map(({ value }) => value),
          backgroundColor: tokenColors,
          borderWidth: 0,
          hoverOffset: 20,
        },
      ],
    }),
    [t, tokens]
  );

  return (
    <Root>
      <Panel className="AwiPanel-wrapper">
        <Typography variant="h1" color="text.active" className="AwiBalanceSection-title">
          {t('balance-section.title')}
        </Typography>
        <Grid container rowSpacing={25} columnSpacing={6.5}>
          <Grid item xs={12} md={7}>
            <Typography variant="h2" className="AwiBalanceSection-groupTitle">
              {t('balance-section.group-tokens')}
            </Typography>
            <Grid container spacing={6.5}>
              {tokens.map((item, itemIndex) => (
                <Grid key={item.key} item xs={12}>
                  <BalanceCard item={item} totalColor={tokenColors[itemIndex % tokenColors.length]} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={5} data-test-id="AwiChart-wrapper">
            <Doughnut
              data={chartData}
              options={{
                cutout: '70%',
                radius: '80%',
                plugins: {
                  /* @ts-ignore */
                  // OutlineDoughnut: {},
                  legend: {
                    title: {
                      font: {
                        family: 'Comfortaa, sans-serif',
                        size: 20,
                      },
                      padding: { top: 4, left: 12 },
                    },
                    labels: {
                      boxWidth: 20,
                      boxHeight: 20,
                      color: 'rgba(255, 255, 255, 1)',
                      font: {
                        family: 'Comfortaa, sans-serif',
                        size: 14,
                      },
                    },
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={7} className="AwiBalanceSection-poolGroup">
            <Typography variant="h2" className="AwiBalanceSection-groupTitle">
              {t('balance-section.group-pool')}
            </Typography>
            <Panel>
              <LabelValue
                id="balanceSectionPool-totalBalance"
                className="AwiBalanceSection-labelValue"
                value={formatAmount(0)}
                labelProps={{
                  children: t('balance-section.total-balance'),
                }}
                sx={{ mb: 6 }}
              />
              <LabelValue
                id="balanceSectionPool-stackedBalance"
                className="AwiBalanceSection-labelValue"
                value={formatAmount(0)}
                labelProps={{
                  children: t('balance-section.staked-balance'),
                }}
              />
            </Panel>
          </Grid>
          <Grid item xs={12} md={5}></Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h2" className="AwiBalanceSection-groupTitle">
              {t('balance-section.group-stable-coins')}
            </Typography>
            <Panel sx={{ p: 0 }}>
              <Grid container sx={{ '.MuiGrid-item:last-child .AwiBalanceCard-root': { border: 0 } }}>
                {stableCoins.map((item) => (
                  <Grid key={item.key} item xs={12}>
                    <BalanceCard item={item} mode="row" />
                  </Grid>
                ))}
              </Grid>
            </Panel>
          </Grid>
          <Grid item xs={12} md={5}></Grid>
        </Grid>
      </Panel>
    </Root>
  );
}
