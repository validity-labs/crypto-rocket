import { ChartDataset, ChartOptions, Plugin } from 'chart.js';
import { random, round } from 'lodash';

import { SHORT_DATE_FORMAT } from '@/app/constants';
import dateIO from '@/app/dateIO';
import { formatPercent, formatUSD } from '@/lib/formatters';
import { MarketType } from '@/types/app';

export const TickVisibility: Plugin = {
  id: 'TickVisibility',
  afterEvent: (chart, args) => {
    const event = args.event;
    // @ts-ignore
    const currentIndex = chart.tickVisibilityIndex;
    if (event.type === 'mouseout' && !args.inChartArea && currentIndex) {
      // @ts-ignore
      chart.tickVisibilityIndex = null;
      chart.update();
    } else if (event.type === 'mousemove') {
      // @ts-ignore
      const elements = chart._active;
      if (elements.length > 0) {
        const activeIndex = elements[0].index;
        if (currentIndex !== activeIndex) {
          // @ts-ignore
          chart.tickVisibilityIndex = activeIndex;
          chart.update();
        }
      } else {
        if (currentIndex !== null) {
          // @ts-ignore
          chart.tickVisibilityIndex = null;
          chart.update();
        } else {
          // @ts-ignore
          chart.tickVisibilityIndex = null;
        }
      }
    }
  },
};

export const getFakeData = () => {
  const today = dateIO.date();
  const dataRecords = new Array(60).fill(0);
  const dates = dataRecords.map((m, mi) => dateIO.addDays(today, -1 * mi)).reverse();

  return {
    labels: dates,
    supply: {
      apy: dataRecords.map((m, mi) => round(random(0, 10, true), 2)),
      total: dataRecords.map((m, mi) => round(random(500000, 1000000000, true), 2)),
    },
    borrow: {
      apy: dataRecords.map((m, mi) => round(random(0, 10, true), 2)),
      total: dataRecords.map((m, mi) => round(random(500000, 1000000000, true), 2)),
    },
  };
};

export const chartDatasets = {
  apy: {
    order: 1,
    labelI18nKey: 'supply-apy',
    // borderColor: '#00D395',
    fill: false,
    borderWidth: 4,
    borderCapStyle: 'round',
    pointRadius: 0,
    pointHoverRadius: 10,

    pointBorderWidth: 0,
    pointHoverBorderWidth: 4,

    pointBackgroundColor: '#ffffff',
    pointHoverBackgroundColor: '#ffffff',

    // pointBorderColor: '#00D395',
    // pointHoverBorderColor: '#00D395',

    // stack: 'combined',
    type: 'line',
    clip: 0,
    cubicInterpolationMode: 'monotone',
    tension: 0.4,
    yAxisID: 'y2',
  } as Omit<ChartDataset<'line'>, 'data'>,
  total: {
    order: 0,
    labelI18nKey: 'total-supply',
    barPercentage: 1,
    categoryPercentage: 0.9,
    // backgroundColor: '#2F3F4E',
    // hoverBackgroundColor: '#00FFEB',
    type: 'bar',
  } as Omit<ChartDataset<'bar'>, 'data'>,
};

export const chartColorsMap: Record<MarketType, [string, string]> = {
  supply: ['#00D395', '#00FFEB'],
  borrow: ['#9669ED', '#d1b9ff'],
};

interface GetChartOptionsProps {
  tooltip: {
    backgroundColor: string;
  };
}

export const getChartOptions = ({ tooltip }: GetChartOptionsProps): ChartOptions<'bar' | 'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  spanGaps: true,
  // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
  plugins: {
    tooltip: {
      mode: 'index',
      itemSort: (a, b) => a.datasetIndex - b.datasetIndex,
      backgroundColor: tooltip.backgroundColor,
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
      intersect: false,
      displayColors: false,
      callbacks: {
        title: () => null,

        label: function (context) {
          const index = context.dataIndex;
          const dts = context.chart.data.datasets[context.datasetIndex];
          const rawValue = dts.data[index] as number;
          const value = context.datasetIndex === 0 ? formatPercent(rawValue) : formatUSD(rawValue);
          return `${dts.label} ${value}`;
        },
        labelTextColor: function ({ chart, datasetIndex }) {
          // @ts-ignore custom property marketType
          return chartColorsMap[chart.data.datasets[datasetIndex].marketType][datasetIndex];
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  scales: {
    y: {
      stacked: true,
      stackWeight: 8,
      stack: 'combine',
      offset: true,
      ticks: {
        display: false,
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y2: {
      stacked: true,
      stackWeight: 2,
      stack: 'combine',
      beginAtZero: true,
      offset: true,
      ticks: {
        display: false,
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    x: {
      ticks: {
        padding: 0,
        callback: function (index) {
          // @ts-ignore custom chart property tickVisibilityIndex
          if (index === this.chart.tickVisibilityIndex) {
            return dateIO.formatByString(this.chart.data.labels[index], SHORT_DATE_FORMAT);
          }
          return '';
        },
        autoSkip: false,
        maxRotation: 0,
        color: '#ffffff',
        font: {
          family: 'Comfortaa, sans-serif',
          size: 16,
        },
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
  },
});
