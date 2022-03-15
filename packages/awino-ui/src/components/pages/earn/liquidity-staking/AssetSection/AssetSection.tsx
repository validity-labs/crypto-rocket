import { useMemo, useState, useEffect } from 'react';

import BigNumber from 'bignumber.js';

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
import { formatAmount, formatEmptyString, formatPercent } from '@/lib/formatters';
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
/* TODO WIP Implement fetching when known how */
const info = {
  youStaked: null,
  totalCollateral: null,
  loanToValue: null,
  yourShare: 0,
  yourDailyRevenue: new BigNumber(0),
  yourWeeklyRevenue: new BigNumber(0),
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
    <Root>
      <Panel>
        <div className="header">
          <Grid container rowSpacing={4}>
            <Grid item xs={12} lg={4}>
              <Label className="title" tooltip={t(`asset-section.title-hint`)}>
                {t(`asset-section.title`)}
              </Label>
              <LabelValue
                id="youStaked"
                className="label-value"
                value={formatEmptyString(info.youStaked)}
                labelProps={{ children: t('asset-section.you-staked') }}
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
                <Grid item xs={18} md={9} lg={6}>
                  <LabelValue
                    id="yourShare"
                    className="label-value-column"
                    value={formatPercent(info.yourShare)}
                    labelProps={{ children: t('asset-section.your-share') }}
                  />
                </Grid>
                <Grid item xs={18} md={9} lg={6}>
                  <LabelValue
                    id="yourDailyRevenue"
                    className="label-value-column"
                    value={formatAmount(info.yourDailyRevenue, { prefix: '$' })}
                    labelProps={{
                      children: t('asset-section.your-daily-revenue.title'),
                      tooltip: t('asset-section.your-daily-revenue.hint'),
                    }}
                  />
                </Grid>
                <Grid item xs={18} md={9} lg={6}>
                  <LabelValue
                    id="yourWeeklyRevenue"
                    className="label-value-column"
                    value={formatAmount(info.yourWeeklyRevenue, { prefix: '$' })}
                    labelProps={{
                      children: t('asset-section.your-weekly-revenue.title'),
                      tooltip: t('asset-section.your-weekly-revenue.hint'),
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
