import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Doughnut } from 'react-chartjs-2';

import { Chart as ChartJS, ChartData, ArcElement, Tooltip, Legend, ChartOptions, TooltipItem } from 'chart.js';
import clsx from 'clsx';

import { IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import usePageTranslation from '@/hooks/usePageTranslation';
import { BalanceInfo, AssetKey } from '@/types/app';

ChartJS.register(ArcElement, Tooltip, Legend);

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '.AwiChartDoughnut-legend': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '75%',
    height: '100%',
    maxHeight: '75%',
    overflow: 'hidden',
    '.MuiTypography-root': {
      pointerEvents: 'none',
      overflow: 'visible',
      textAlign: 'center',
      userSelect: 'none',
    },
    ul: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      margin: theme.spacing(0, 0, 2),
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: '6px',
      },
      'button.Awi-active': {
        backgroundColor: theme.palette.action.selected,
        transition: `background-color 0.5s`,
      },
    },
  },

  [theme.breakpoints.up('sm')]: {
    '.AwiChartDoughnut-legend': {
      maxWidth: 160,
      maxHeight: 160,
    },
  },
}));

type EnterLeaveType = 'enter' | 'leave';
type LegendItemHoverCallback = (type: EnterLeaveType, index: number) => void;

interface LegendItemProps {
  item: string;
  active: boolean;
  index: number;
  onHover: LegendItemHoverCallback;
}

const LegendItem = ({ item, index, onHover, active }: LegendItemProps) => {
  const t = usePageTranslation();

  const hovered = useRef(false);

  const handleMouseEnter = () => {
    if (!hovered.current) {
      hovered.current = true;
      onHover('enter', index);
    }
  };
  const handleMouseLeave = () => {
    if (hovered.current) {
      hovered.current = false;
      onHover('leave', index);
    }
  };
  const title = t(`balance-section.assets.${item}.title`);
  return (
    <IconButton
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      size="small"
      className={clsx({ 'Awi-active': active })}
    >
      <img src={`/images/assets/${item}.svg`} alt={title} title={title} width="30" height="30" />
    </IconButton>
  );
};

export type CustomDoughnutChartData = BalanceInfo<AssetKey | 'total' | 'staked'> & {
  tooltipValue?: string;
};

interface Props {
  data: CustomDoughnutChartData[];
  i18nKey: string;
  colors: string[];
  customLabel?: (item: TooltipItem<'doughnut'>) => string;
}

export default function DoughnutChart({ data, i18nKey, colors, customLabel }: Props) {
  const t = usePageTranslation();

  const chartRef = useRef();
  const [hoveredElementIndex, setHoveredElementIndex] = useState(null);

  const chartData = useMemo<ChartData<'doughnut', number[], string>>(
    () => ({
      labels: data.map(({ key }) => key.toUpperCase()),
      datasets: [
        {
          label: t(`balance-section.chart.${i18nKey}.title`),
          /* @ts-ignore */
          data,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 20,
        },
      ],
    }),
    [i18nKey, t, data, colors]
  );

  const handleLegendHover = useCallback((type: EnterLeaveType, index: number) => {
    if (chartRef.current) {
      const chart = chartRef.current as ChartJS;
      const activeSegment = chart.getDatasetMeta(0).data[index];
      const isEnter = type === 'enter';
      chart.updateHoverStyle([{ element: activeSegment, datasetIndex: 0, index }], 'dataset', isEnter);
      chart.tooltip.setActiveElements(isEnter ? [{ datasetIndex: 0, index }] : [], { x: 0, y: 0 });
      // chart.tooltip.update();
      chart.render();
    }
  }, []);

  const handleChartHover = useCallback(
    (event, elements, chart) => {
      if (elements.length) {
        if (hoveredElementIndex !== elements[0].index) {
          setHoveredElementIndex(elements[0].index);
        }
      } else {
        if (hoveredElementIndex !== null) {
          setHoveredElementIndex(null);
        }
      }
    },
    [hoveredElementIndex]
  );

  const chartOptions = useMemo<ChartOptions<'doughnut'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10,
      },
      cutout: '80%',
      radius: '100%',
      onHover: handleChartHover,
      parsing: {
        key: 'total',
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          display: false,
          cornerRadius: 10,
          padding: 10,
          bodyAlign: 'center',
          bodySpacing: 8,
          xAlign: 'center',
          yAlign: 'center',
          bodyFont: {
            family: 'Comfortaa, sans-serif',
            size: 14,
          },
          displayColors: false,
          ...(customLabel && {
            callbacks: {
              label: customLabel,
            },
          }),
        },
      },
    }),
    [handleChartHover, customLabel]
  );

  return (
    <Root className="AwiChartDoughnut-wrapper" data-test-id="AwiChart-wrapper">
      <div className="AwiChartDoughnut-legend">
        <ul>
          {data.map(({ key }, index) => (
            <li key={index}>
              <LegendItem item={key} index={index} active={hoveredElementIndex === index} onHover={handleLegendHover} />
            </li>
          ))}
        </ul>
        <Typography color="text.primary" fontWeight={500}>
          {t(`balance-section.chart.${i18nKey}.title`)}
        </Typography>
      </div>
      <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
    </Root>
  );
}
