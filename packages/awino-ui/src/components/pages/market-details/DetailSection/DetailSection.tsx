import { useEffect, useMemo, useState } from 'react';

import { Chart } from 'react-chartjs-2';

import BigNumber from 'bignumber.js';
import {
  Chart as ChartJS,
  ChartData,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  PointElement,
  LineElement,
  LineController,
  ChartOptions,
} from 'chart.js';
import AnnotationPlugin from 'chartjs-plugin-annotation';

import { CircularProgress, Grid, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount, formatPercent, formatUSD } from '@/lib/formatters';
import { AssetKey, MarketInfo } from '@/types/app';

import { chartDatasets as baseChartDatasets, getChartOptions, getFakeData, TickLine } from './chart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  TickLine,
  AnnotationPlugin
);

const Root = styled(Section)(({ theme }) => ({
  '.MuiTableRow-root': {
    borderBottom: `1px solid ${theme.palette.divider} !important`,
    '&:last-of-type': {
      border: 'none !important',
    },
  },
}));

const customFormatAmount = (value: BigNumber) => formatAmount(value);
const customFormatAssetAmount = (value: BigNumber, asset: Uppercase<AssetKey>) =>
  formatAmount(value, { postfix: asset });
const customFormatPercent = (value: BigNumber) => formatPercent(value.toNumber());
const formatExchangeRate = (value: BigNumber, asset: Uppercase<AssetKey>) =>
  `1 ${asset} = ${formatAmount(value)} c${asset}`;

interface MarketDetailItem {
  field: keyof MarketInfo;
  i18nKey: string;
  format: (value: BigNumber, asset?: Uppercase<AssetKey>) => string;
}

const marketDetailItem: MarketDetailItem[] = [
  { field: 'price', i18nKey: 'price', format: formatUSD },
  { field: 'marketLiquidity', i18nKey: 'market-liquidity', format: customFormatAssetAmount },
  { field: 'nOfSuppliers', i18nKey: 'n-of-suppliers', format: customFormatAmount },
  { field: 'nOfBorrowers', i18nKey: 'n-of-borrowers', format: customFormatAmount },
  { field: 'borrowCap', i18nKey: 'borrow-cap', format: formatUSD },
  { field: 'interestPaidDay', i18nKey: 'interest-paid-day', format: formatUSD },
  { field: 'reserves', i18nKey: 'reserves', format: customFormatAssetAmount },
  { field: 'reserveFactor', i18nKey: 'reserve-factor', format: customFormatPercent },
  { field: 'collateralFactor', i18nKey: 'collateral-factor', format: customFormatPercent },
  { field: 'cMinted', i18nKey: 'ctoken-minted', format: customFormatAmount },
  { field: 'exchangeRate', i18nKey: 'exchange-rate', format: formatExchangeRate },
];
interface Props {
  asset: Uppercase<AssetKey>;
  info: MarketInfo;
}

export default function DetailSection({ asset, info }: Props) {
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
      annotation: {
        label: t(`detail-section.model.current`),
        value: info.utilization.toNumber(),
        backgroundColor: isDark ? 'rgba(0,0,0, 0.3)' : '#091e29',
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0,0,0, 0.3)' : '#091e29',
      },
    });
  }, [t, info.utilization, theme.palette.mode]);

  const chartData = useMemo<ChartData>(() => {
    const isDark = theme.palette.mode === 'dark';
    return {
      labels: data?.labels || [],
      datasets: [
        {
          ...baseChartDatasets.base,
          label: t(`detail-section.model.chart.base`),
          data: data?.base,
          borderColor: isDark ? theme.palette.common.white : theme.palette.grey[400],
          pointBorderColor: '#00D395',
          pointHoverBorderColor: '#00D395',
        },
        {
          ...baseChartDatasets.supply,
          label: t(`detail-section.model.chart.supply`),
          data: data?.supply,
        },
        {
          ...baseChartDatasets.borrow,
          label: t(`detail-section.model.chart.borrow`),
          data: data?.borrow,
        },
      ],
    } as ChartData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, t, theme.palette.mode]);

  return (
    <Root>
      <Grid container spacing={12}>
        <Grid item xs={12} md={6}>
          <Panel
            header={
              <Typography variant="h6" component="h2">
                {t('detail-section.model.title')}
              </Typography>
            }
          >
            <Typography variant="h6" component="h3" color="text.secondary" mb={14}>
              {t('detail-section.model.utilization-vs-apy')}
            </Typography>
            <div
              style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              data-test-id="AwiChart-wrapper"
            >
              {data ? <Chart type="bar" data={chartData} options={chartOptions} /> : <CircularProgress />}
            </div>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Panel
            header={
              <Typography variant="h6" component="h2">
                {t('detail-section.details.title')}
              </Typography>
            }
          >
            <Table>
              <TableBody>
                {marketDetailItem.map(({ field, i18nKey, format }, mdi) => (
                  <TableRow key={mdi}>
                    <TableCell>
                      <Typography variant="body-md">{t(`detail-section.details.${i18nKey}`, { asset })}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body-md" color="text.primary">
                        {format(info[field], asset)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </Grid>
      </Grid>
    </Root>
  );
}
