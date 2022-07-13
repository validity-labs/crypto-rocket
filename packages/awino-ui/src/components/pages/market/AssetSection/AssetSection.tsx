import { useCallback, useMemo, useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridEventListener, GridEvents, GridRowsProp, GridSortModel } from '@mui/x-data-grid';

import { TABLE_ROWS_PER_PAGE, TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import loadData from '@/app/data';
import DataGrid from '@/components/general/DataGrid/DataGrid';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import Label from '@/components/general/Label/Label';
import LabelValue from '@/components/general/LabelValue/LabelValue';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatUSD } from '@/lib/formatters';
import { RowsState } from '@/types/app';
import { TotalAssetSize } from '@/types/pages/market';

import getColumns from './columns';

const Root = styled(Section)(({ theme }) => ({
  '.AwiLabelValue-label': {
    color: theme.palette.text.secondary,
    fontWeight: 400,
  },
  '.AwiLabelValue-value': {
    fontSize: '1.125rem' /* 18px */,
  },
}));

interface Props {
  total: TotalAssetSize;
}

export default function AssetSection({ total }: Props) {
  const t = usePageTranslation();
  const router = useRouter();
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
      const { total, records } = await loadData('market', {
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

  const handleRowClick: GridEventListener<GridEvents.rowClick> = useCallback(
    (props) => {
      router.push(`/market/${props.row.asset}`);
    },
    [router]
  );

  return (
    <Root>
      <Panel
        header={
          <>
            <Typography variant="h4" component="h1" color="text.active" fontWeight="bold">
              {t(`asset-section.title`)}
            </Typography>
            <div className="aside">
              <LabelValue
                id="marketTotalSize"
                value={formatUSD(total.market)}
                labelProps={{
                  children: t('asset-section.market-total-size'),
                }}
              />
              <LabelValue
                id="platformTotalFee"
                value={formatUSD(total.platform)}
                labelProps={{
                  children: t('asset-section.platform.total-fee'),
                  tooltip: t('asset-section.platform.total-fee-hint'),
                }}
              />
            </div>
          </>
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
            rowHeight={66}
            rowsPerPageOptions={TABLE_ROWS_PER_PAGE_OPTIONS}
            // rows
            rows={rows}
            rowCount={rowCountState}
            onRowClick={handleRowClick}
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
            componentsProps={{
              row: {
                className: 'Awi-selectable',
              },
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
    </Root>
  );
}
