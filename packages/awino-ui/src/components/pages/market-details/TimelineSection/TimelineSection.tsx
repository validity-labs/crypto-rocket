import React, { useEffect, useMemo, useState } from 'react';

import { Chart } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  ChartData,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartOptions,
} from 'chart.js';

import { CircularProgress, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

import LabelValue from '@/components/general/LabelValue/LabelValue';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatPercent, formatUSD } from '@/lib/formatters';
import { MarketType, MarketTypeInfo, SetState } from '@/types/app';

import { chartColorsMap, chartDatasets, getChartOptions, getFakeData, TickVisibility } from './chart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, PointElement, LineElement, TickVisibility);

const Root = styled(Section)(({ theme }) => ({
  paddingTop: 0,
  // '.AwiTimelineSection-marketType': {
  // color: theme.palette.text.secondary,
  // '[value="supply"].Mui-selected': {
  //   color: chartColorsMap.supply[0],
  // },
  // '[value="borrow"].Mui-selected': {
  //   color: chartColorsMap.borrow[0],
  // },
  // },
  '.AwiTimelineSection-stats': {
    '>div': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing(6),
      padding: theme.spacing(6.5, 13, 5),
      borderRadius: +theme.shape.borderRadius * 9,
      textAlign: 'center',
      backgroundColor: theme.palette.background.transparent,
    },
  },
  '.AwiTimelineSection-labelValue': {
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    '.AwiLabelValue-label': {
      order: 1,
      margin: 0,
      ...theme.typography['body-sm'],
      fontWeight: 'medium',
      color: theme.palette.text.secondary,
    },
    '.AwiLabelValue-value': {
      ...theme.typography.body,
      fontWeight: 'bold',
    },
  },

  [theme.breakpoints.up('md')]: {
    '.AwiTimelineSection-stats': {
      display: 'inline-block',
      '>div': {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
    },
  },
}));

interface Props {
  type: MarketType;
  setType: SetState<MarketType>;
  info: MarketTypeInfo;
}

export default function TimelineSection({ type, setType, info }: Props) {
  const t = usePageTranslation();
  const [data, setData] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    setTimeout(() => {
      setData(getFakeData());
    }, 1000);
  }, []);

  const chartOptions = useMemo<ChartOptions<'line'>>(() => {
    const isDark = theme.palette.mode === 'dark';
    return getChartOptions({
      tooltip: {
        backgroundColor: isDark ? 'rgba(0,0,0, 0.3)' : '#091e29',
      },
    });
  }, [theme.palette.mode]);

  const chartData = useMemo<ChartData>(() => {
    // @ts-ignore custom dataset property labelI18nKey
    const { labelI18nKey: apyLabelI18nKey, ...restOfApy } = chartDatasets.apy;

    // @ts-ignore custom dataset property labelI18nKey
    const { labelI18nKey: totalLabelI18nKey, ...restOfTotal } = chartDatasets.total;
    const [primaryColor, secondaryColor] = chartColorsMap[type];
    const isDark = theme.palette.mode === 'dark';
    return {
      labels: data?.labels || [],
      datasets: [
        {
          // @ts-ignore custom dataset property; used to choose proper color
          marketType: type,
          ...restOfApy,
          label: t(`timeline-section.chart.${type}.apy`),

          borderColor: primaryColor,
          pointBorderColor: primaryColor,
          pointHoverBorderColor: primaryColor,
          data: data?.[type].apy,
        },
        {
          // @ts-ignore custom dataset property; used to choose proper color
          marketType: type,
          ...restOfTotal,
          label: t(`timeline-section.chart.${type}.total`),
          backgroundColor: isDark ? '#2F3F4E' : theme.palette.grey[400],
          hoverBackgroundColor: secondaryColor,
          data: data?.[type].total,
        },
      ],
    } as ChartData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, data, t, theme.palette.mode]);

  const handleType = (event: React.MouseEvent<HTMLElement>, newType: MarketType) => {
    setType(newType);
  };
  return (
    <Root>
      <Grid container mb={10} spacing={10} alignItems="center">
        <Grid item xs={12} md={4}>
          <ToggleButtonGroup
            // className="AwiTimelineSection-marketType"
            value={type}
            exclusive
            onChange={handleType}
            aria-label={t(`timeline-section.market-switch-hint`)}
          >
            <ToggleButton value="supply">{t(`timeline-section.supply.title`)}</ToggleButton>
            <ToggleButton value="borrow">{t(`timeline-section.borrow.title`)}</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12} md={8} textAlign="end">
          <div className="AwiTimelineSection-stats">
            <div>
              <LabelValue
                id="timelineSectionInfo-netValue"
                className="AwiTimelineSection-labelValue"
                value={formatPercent(info[type].netRate)}
                labelProps={{
                  children: t(`timeline-section.${type}.net-rate`),
                }}
              />
              <LabelValue
                id="timelineSectionInfo-apy"
                className="AwiTimelineSection-labelValue"
                value={formatPercent(info[type].apy)}
                labelProps={{
                  children: t(`timeline-section.${type}.apy`),
                }}
              />
              <LabelValue
                id="timelineSectionInfo-distributionApy"
                className="AwiTimelineSection-labelValue"
                value={formatPercent(info[type].distributionApy)}
                labelProps={{
                  children: t(`timeline-section.${type}.distribution-apy`),
                }}
              />
              <LabelValue
                id="timelineSectionInfo-total"
                className="AwiTimelineSection-labelValue"
                value={formatUSD(info[type].total)}
                labelProps={{
                  children: t(`timeline-section.${type}.total`),
                }}
              />
            </div>
          </div>
        </Grid>
      </Grid>
      <div
        style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        data-test-id="AwiChart-wrapper"
      >
        {data ? <Chart type="bar" data={chartData} options={chartOptions} /> : <CircularProgress />}
      </div>
    </Root>
  );
}
