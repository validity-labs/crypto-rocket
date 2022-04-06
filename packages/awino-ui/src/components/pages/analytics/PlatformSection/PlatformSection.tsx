import { useMemo, useState, useEffect } from 'react';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridRowsProp, GridSortModel } from '@mui/x-data-grid';

import { TABLE_ROWS_PER_PAGE, TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import loadData from '@/app/data';
import DataGrid from '@/components/general/DataGrid/DataGrid';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatEmptyString, formatUSD } from '@/lib/formatters';
import { RowsState } from '@/types/app';

import getColumns from './columns';

const Root = styled(Section)(({ theme }) => ({
  '.label-value-column': {
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: theme.spacing(0, 0, 13),
    '.label': {
      margin: theme.spacing(0, 0, 4),
      ...theme.typography['body-lg'],
      fontWeight: 500,
      color: theme.palette.text.secondary,
    },
    '.value': {
      ...theme.typography.h3,
      fontWeight: 600,
    },
  },
  '.MuiDataGrid-root .MuiDataGrid-row': {
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      margin: 0,
    },
    '&.Mui-selected, &:hover, &.Mui-selected:hover': {
      backgroundColor: 'transparent',
      // backgroundColor: alpha('#00FFEB', 0.1),
    },
  },
  [theme.breakpoints.up('md')]: {},
}));

interface Props {
  stats: any;
}

export default function PlatformSection({ stats }: Props) {
  const t = usePageTranslation();
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
      const { total, records } = await loadData('analytics', {
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
  }, [sortModel, rowsState /* data */]);

  return (
    <Root>
      <Grid container columnSpacing={9} rowSpacing={15}>
        <Grid item xs={12} md={7}>
          <Panel
            header={
              <Label component="h2" id="dailyPlatformFees" tooltip={t('platform-section.daily-fees.title-hint')}>
                {t('platform-section.daily-fees.title')}
              </Label>
            }
          >
            <div className="table-container">
              <DataGrid
                loading={loading}
                columns={columns}
                disableColumnMenu
                disableColumnFilter
                disableSelectionOnClick
                disableColumnSelector
                rowHeight={56}
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
          </Panel>
        </Grid>
        <Grid item xs={12} md={5}>
          <Panel
            header={
              <Label id="platformStats" className="label" tooltip={t('platform-section.stats.title-hint')}>
                {t('platform-section.stats.title')}
              </Label>
            }
          >
            <LabelValue
              id="totalDeposits"
              className="label-value-column"
              value={formatUSD(stats.totalDeposit)}
              /* @ts-ignore */
              labelProps={{ component: 'h3', children: t('platform-section.stats.total-deposits') }}
            />
            <LabelValue
              id="totalBorrow"
              className="label-value-column"
              value={formatUSD(stats.totalBorrow)}
              /* @ts-ignore */
              labelProps={{ component: 'h3', children: t('platform-section.stats.total-borrows') }}
            />
            <LabelValue
              id="globalHealthRatio"
              className="label-value-column"
              value={formatEmptyString(stats.globalHealthRatio)}
              labelProps={{
                /* @ts-ignore */
                component: 'h3',
                children: t('platform-section.stats.health-ratio'),
                tooltip: t('platform-section.stats.health-ratio-hint'),
              }}
            />
            <LabelValue
              id="totalPlatformFee"
              className="label-value-column"
              value={formatUSD(stats.totalPlatformFee)}
              labelProps={{
                /* @ts-ignore */
                component: 'h3',
                children: t('platform-section.stats.total-fees'),
                tooltip: t('platform-section.stats.total-fees-hint'),
              }}
            />
          </Panel>
        </Grid>
      </Grid>
    </Root>
  );
}
