import { ChartDataset, ChartOptions, Plugin } from 'chart.js';
import Chart from 'chart.js/auto';
import { random, round } from 'lodash';

import { SHORT_DATE_FORMAT } from '@/app/constants';
import dateIO from '@/app/dateIO';
import { formatPercent, formatUSD } from '@/lib/formatters';
import { MarketType } from '@/types/app';

export const TickLine: Plugin = {
  id: 'TickLine',
  beforeDraw: (chart) => {
    const elements = chart.tooltip?.getActiveElements();
    if (elements.length) {
      let x = elements[0].element.x;
      let yAxis = chart.scales.y;
      let ctx = chart.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, yAxis.top);
      ctx.lineTo(x, yAxis.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(81, 81, 81, 1)';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.restore();
    }
  },
};

export const getFakeData = () => {
  const dataRecords = new Array(101).fill(0);
  const ln = dataRecords.length;
  return {
    labels: dataRecords.map((m, mi) => mi),
    base: dataRecords.map((m, mi) => ({ x: mi, y: 0, p: mi })),
    supply: dataRecords.map((m, mi) => round((mi / ln) * 14.53 + 2.31, 2)),
    borrow: dataRecords.map((m, mi) => round((mi / ln) * 10.35), 2),
  };
};

export const chartDatasets = {
  base: {
    // order: 1,
    labelI18nKey: 'base',
    borderColor: '#ffffff',
    fill: false,
    borderWidth: 4,
    borderCapStyle: 'round',
    pointRadius: 0,
    pointHoverRadius: 10,

    pointBorderWidth: 0,
    pointHoverBorderWidth: 4,

    pointBackgroundColor: '#ffffff',
    pointHoverBackgroundColor: '#ffffff',

    pointBorderColor: '#ffffff',
    pointHoverBorderColor: '#00FFEB',

    // stack: 'combined',
    type: 'line',
    clip: 0,
    cubicInterpolationMode: 'monotone',
    tension: 0.4,
    yAxisID: 'y2',
  } as Omit<ChartDataset<'line'>, 'data'>,
  supply: {
    // order: 1,
    labelI18nKey: 'supply-apy',
    borderColor: '#00D395',
    fill: false,
    borderWidth: 4,
    borderCapStyle: 'round',
    pointRadius: 0,
    pointHoverRadius: 10,

    pointBorderWidth: 0,
    pointHoverBorderWidth: 4,

    pointBackgroundColor: '#ffffff',
    pointHoverBackgroundColor: '#ffffff',

    pointBorderColor: '#00D395',
    pointHoverBorderColor: '#00D395',

    type: 'line',
    clip: 0,
    cubicInterpolationMode: 'monotone',
    tension: 0.4,
  } as Omit<ChartDataset<'line'>, 'data'>,
  borrow: {
    // order: 1,
    labelI18nKey: 'borrow-apy',
    borderColor: '#9669ED',
    fill: false,
    borderWidth: 4,
    borderCapStyle: 'round',
    pointRadius: 0,
    pointHoverRadius: 10,

    pointBorderWidth: 0,
    pointHoverBorderWidth: 4,

    pointBackgroundColor: '#ffffff',
    pointHoverBackgroundColor: '#ffffff',

    pointBorderColor: '#9669ED',
    pointHoverBorderColor: '#9669ED',

    type: 'line',
    clip: 0,
    cubicInterpolationMode: 'monotone',
    tension: 0.4,
  } as Omit<ChartDataset<'line'>, 'data'>,
};

export const chartColorsMap = ['#ffffff', '#00D395', '#9669ED'];

interface GetChartOptionsProps {
  annotation: {
    label: string;
    value: number;
    backgroundColor: string;
  };
  tooltip: {
    backgroundColor: string;
  };
}
export const getChartOptions = ({ annotation, tooltip }: GetChartOptionsProps): ChartOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  spanGaps: true,
  // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
  plugins: {
    annotation: {
      annotations: {
        annotation: {
          type: 'line',
          borderColor: 'rgba(81, 81, 81, 1)',
          borderDash: [3, 3],
          borderDashOffset: 0,
          borderWidth: 1,
          // display: (ctx) => ctx.chart.isDatasetVisible(1),
          label: {
            enabled: true,
            content: annotation.label,
            position: '50%',
            padding: 10,
            cornerRadius: 10,
            backgroundColor: annotation.backgroundColor,
          },
          scaleID: 'x',
          value: annotation.value,
        },
      },
    },
    tooltip: {
      mode: 'index',
      // itemSort: (a, b) => a.datasetIndex - b.datasetIndex,
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
          const dataItem = dts.data[index];
          // @ts-ignore
          const value = formatPercent((context.datasetIndex === 0 ? dataItem.p : dataItem) as number);
          return `${dts.label} ${value}`;
        },
        labelTextColor: function ({ datasetIndex }) {
          // @ts-ignore custom property marketType
          return chartColorsMap[datasetIndex];
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
        display: false,
        padding: 0,
        // callback: function (index) {
        //   // @ts-ignore custom chart property tickVisibilityIndex
        //   if (index === this.chart.tickVisibilityIndex) {
        //     return dateIO.formatByString(this.chart.data.labels[index], SHORT_DATE_FORMAT);
        //   }
        //   return '';
        // },
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
