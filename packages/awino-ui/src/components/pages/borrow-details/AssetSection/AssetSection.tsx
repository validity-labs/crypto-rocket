import { useMemo, useState, useEffect } from 'react';

import { Grid } from '@mui/material';
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
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAWI, formatEmptyString, formatPercent, formatUSD } from '@/lib/formatters';
import { RowsState } from '@/types/app';

import getColumns from './columns';

const Root = styled(Section)(({ theme }) => ({
  '.header': {
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

  [theme.breakpoints.up('md')]: {},
}));

// interface Props {
//   total: TotalAssetSize;
// }

const info = {
  youBorrowed: null,
  totalCollateral: null,
  loanToValue: null,
  utilizationRate: 44.23,
  availableLiquidity: 53423233.22,
  assetPrice: 1.47,
  variableBorrowAPY: 5.63,
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
      const { total, records } = await loadData('borrow-details', {
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
    <Root>
      <Panel>
        <div className="header">
          <Grid container rowSpacing={4}>
            <Grid item xs={12} lg={4}>
              <Label className="title" tooltip={t(`asset-section.title-hint`)}>
                {t(`asset-section.title`)}
              </Label>
              <LabelValue
                id="youBorrowed"
                className="label-value"
                value={formatEmptyString(info.youBorrowed)}
                labelProps={{ children: t('asset-section.you-borrowed') }}
              />
              <LabelValue
                id="totalCollateral"
                className="label-value"
                value={formatEmptyString(info.totalCollateral)}
                labelProps={{ children: t('asset-section.total-collateral') }}
              />
              <LabelValue
                id="loanToValue"
                className="label-value"
                value={formatEmptyString(info.loanToValue)}
                labelProps={{ children: t('asset-section.loan-to-value') }}
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
                    id="assetPrice"
                    className="label-value-column"
                    value={formatUSD(info.assetPrice)}
                    labelProps={{ children: t('asset-section.asset-price') }}
                  />
                </Grid>
                <Grid item xs={18} md={9} lg={6}>
                  <LabelValue
                    id="variableBorrowAPY"
                    className="label-value-column"
                    value={formatPercent(info.variableBorrowAPY)}
                    labelProps={{
                      children: t('asset-section.variable-borrow-apy'),
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
    </Root>
  );
}
