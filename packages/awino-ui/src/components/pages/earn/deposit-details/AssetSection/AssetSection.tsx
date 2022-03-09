import { useMemo, useState, useEffect } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridRowsProp, GridSortModel } from '@mui/x-data-grid';

import { TABLE_ROWS_PER_PAGE, TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import loadData from '@/app/data';
import { useAppSelector } from '@/app/hooks';
import ConnectPanel from '@/components/general/ConnectPanel/ConnectPanel';
import DataGrid from '@/components/general/DataGrid/DataGrid';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAWI, formatEmptyString, formatPercent, formatUSD } from '@/lib/formatters';
import { RowsState } from '@/types/app';

import getColumns from './columns';

const Panel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: +theme.shape.borderRadius * 5,
  backgroundColor: theme.palette.background.transparent,
  '.header': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(10),
    padding: theme.spacing(5.5, 6.5, 5),
    margin: theme.spacing(0, 0, 15, 0),
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
    '.title': {
      marginBottom: theme.spacing(7.5),
    },
    '.label-value': {
      marginBottom: theme.spacing(4.5),
    },
    '.label-value-column': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      '.label': {
        margin: theme.spacing(0, 0, 3),
        color: theme.palette.text.secondary,
      },
      '.value': {
        color: theme.palette.text.primary,
      },
      '.label, .value': {
        fontSize: '0.9375rem' /* 15px */,
        fontWeight: 500,
      },
    },
  },
  '.content': {
    padding: theme.spacing(4, 12.5, 10),
    '.table-container': {
      height: 888 /* 66 * 10 + 12 * 10 - 12 */,
      width: '100%',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.header': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(18),
      padding: theme.spacing(5.5, 12.5, 5),
    },
  },
}));

// interface Props {
//   total: TotalAssetSize;
// }

const info = {
  yourBalance: null,
  walletBalance: null,
  utilizationRate: 44.23,
  availableLiquidity: 53423233.22,
  depositAPY: 1.47,
  asCollateral: true,
  assetPrice: 1.47,
  maximumLTV: 50,
  threshold: 65,
  penalty: 10,
};

export default function AssetSection(/* { total }: Props */) {
  const t = usePageTranslation();
  const { connected } = useAppSelector((state) => ({
    connected: state.account.connected,
  }));
  const columns = useMemo(() => {
    return getColumns(t);
  }, [t]);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    /* { field: 'asset', sort: 'asc' } */
  ]);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowCount, setRowCount] = useState<number | undefined>(undefined);
  // Some api client return undefine while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(rowCount || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) => (rowCount !== undefined ? rowCount : prevRowCountState));
  }, [rowCount, setRowCountState]);

  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: TABLE_ROWS_PER_PAGE,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setRowCount(undefined);
    (async () => {
      if (!connected) {
        return;
      }
      const { total, records } = await loadData('earn-deposit-details', {
        page: rowsState.page,
        pageSize: rowsState.pageSize,
        sort: sortModel,
      });
      if (!active) {
        return;
      }
      setRows(records);
      setRowCount(total);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [sortModel, rowsState, connected /* data */]);

  return (
    <Section>
      <Panel>
        <div className="header">
          <Grid container rowSpacing={4}>
            <Grid item xs={12} lg={4}>
              <Label className="title" tooltip={t(`asset-section.title-hint`)}>
                {t(`asset-section.title`)}
              </Label>
              <LabelValue
                id="yourBalance"
                className="label-value"
                value={formatEmptyString(info.yourBalance)}
                labelProps={{ children: t('asset-section.your-balance') }}
              />
              <LabelValue
                id="walletBalance"
                className="label-value"
                value={formatEmptyString(info.walletBalance)}
                labelProps={{ children: t('asset-section.wallet-balance') }}
              />
            </Grid>
            <Grid item xs={12} lg={8}>
              <Grid container columns={18} rowSpacing={8} columnSpacing={12.5}>
                <Grid item xs={18} md={9} lg={4}>
                  <LabelValue
                    id="utilizationRate"
                    className="label-value-column"
                    value={formatPercent(info.utilizationRate)}
                    labelProps={{ children: t('asset-section.utilization-rate') }}
                  />
                </Grid>
                <Grid item xs={18} md={9} lg={4}>
                  <LabelValue
                    id="availableLiquidity"
                    className="label-value-column"
                    value={formatAWI(info.availableLiquidity)}
                    labelProps={{ children: t('asset-section.available-liquidity') }}
                  />
                </Grid>
                <Grid item xs={18} md={9} lg={4}>
                  <LabelValue
                    id="depositAPY"
                    className="label-value-column"
                    value={formatUSD(info.depositAPY)}
                    labelProps={{ children: t('asset-section.deposit-apy') }}
                  />
                </Grid>
                <Grid item xs={18} md={9} lg={6}>
                  <LabelValue
                    id="asCollateral"
                    className="label-value-column"
                    value={
                      <Typography color="text.active" component="span">
                        {t(`asset-section.as-collateral.${info.asCollateral ? 'yes' : 'no'}`)}
                      </Typography>
                    }
                    labelProps={{ children: t('asset-section.as-collateral.title') }}
                  />
                </Grid>
                <Grid item xs={18} md={9} lg={4}>
                  <LabelValue
                    id="assetPrice"
                    className="label-value-column"
                    value={formatUSD(info.assetPrice)}
                    labelProps={{ children: t('asset-section.asset-price') }}
                  />
                </Grid>
                <Grid item xs={18} md={9} lg={4}>
                  <LabelValue
                    id="maximumLTV"
                    className="label-value-column"
                    value={formatPercent(info.maximumLTV)}
                    labelProps={{
                      children: t('asset-section.maximum-ltv.title'),
                      tooltip: t('asset-section.maximum-ltv.hint'),
                    }}
                  />
                </Grid>
                <Grid item xs={18} md={9} lg={4}>
                  <LabelValue
                    id="threshold"
                    className="label-value-column"
                    value={formatPercent(info.threshold)}
                    labelProps={{
                      children: t('asset-section.threshold.title'),
                      tooltip: t('asset-section.threshold.hint'),
                    }}
                  />
                </Grid>
                <Grid item xs={18} md={9} lg={6}>
                  <LabelValue
                    id="penalty"
                    className="label-value-column"
                    value={formatPercent(info.penalty)}
                    labelProps={{
                      children: t('asset-section.penalty.title'),
                      tooltip: t('asset-section.penalty.hint'),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className="content">
          {connected ? (
            <div className="table-container">
              <DataGrid
                loading={loading}
                columns={columns}
                disableColumnMenu
                disableColumnFilter
                disableSelectionOnClick
                disableColumnSelector
                rowHeight={66}
                rowsPerPageOptions={TABLE_ROWS_PER_PAGE_OPTIONS}
                // rows
                rows={rows}
                rowCount={rowCountState}
                // sorting
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                // pagination
                paginationMode="server"
                {...rowsState}
                onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
                onPageSizeChange={(pageSize) => setRowsState((prev) => ({ ...prev, pageSize }))}
                components={{
                  Pagination: GridPagination,
                }}
                localeText={{
                  columnHeaderSortIconLabel: t('common.table.sort', { ns: 'common' }),
                  footerTotalVisibleRows: (visibleCount, totalCount) =>
                    t('common.table.rows-out-of', {
                      visibleCount: visibleCount.toLocaleString(),
                      totalCount: totalCount.toLocaleString() + '1',
                    }),
                }}
              />
            </div>
          ) : (
            <ConnectPanel back="/earn/deposit" />
          )}
        </div>
      </Panel>
    </Section>
  );
}
