import { useMemo } from 'react';

import { useTranslation } from 'next-i18next';

import { styled } from '@mui/material/styles';

import { TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import DataGrid from '@/components/general/DataGrid/DataGrid';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AssetKeyPair } from '@/types/app';

import getColumns from './columns';
import GridRow from './GridRow';
import { FarmDataItem } from './ResultSection';

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  height: 888 /* 66 * 10 + 12 * 10 - 12 */,
  width: '100%',
  '.AwiResultTable-pair': {
    // alignSelf: 'flex-start',
    // margin: theme.spacing(0, 0, 2.5),
    fontWeight: 500,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
    '.AwiAssetIcons-root': {
      marginRight: theme.spacing(8),
    },
  },
  '.AwiResultTable-tooltip': {
    fontSize: '14px',
    color: theme.palette.text.active,
  },
  '.MuiTableContainer-root': {
    maxHeight: 400,
    margin: theme.spacing(0, 0, 11),
  },
  '.MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: 'unset',
  },
  '.MuiTableBody-root .MuiTableRow-root': {
    borderTop: `1px solid ${theme.palette.divider} !important`,
  },
  '.MuiDataGrid-row': {
    // borderRadius: +theme.shape.borderRadius * 5,
    // backgroundColor: theme.palette.background.transparent,
    backgroundColor: 'unset',
    '&:not(:last-child)': {
      margin: `0 !important`,
    },
  },
}));

interface Props {
  loading: boolean;
  items: FarmDataItem[];
  onHarvest: (pair: AssetKeyPair) => void;
  onApprove: (pair: AssetKeyPair) => void;
}
export default function ResultTable({ loading, onHarvest, onApprove, items }: Props) {
  const t = usePageTranslation({ keyPrefix: 'result-section' });
  const columns = useMemo(() => {
    return getColumns(t);
  }, [t]);
  const { t: tRaw } = useTranslation();
  return (
    <Root>
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
        rows={items}
        rowCount={items.length}
        // // sorting
        // sortingMode="server"
        // sortModel={sortModel}
        // onSortModelChange={handleSortModelChange}
        // pagination
        paginationMode="client"
        // {...rowsState}
        // onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
        // onPageSizeChange={(pageSize) => setRowsState((prev) => ({ ...prev, pageSize }))}
        components={{
          Pagination: GridPagination,
          Row: GridRow,
        }}
        componentsProps={{
          row: {
            onApprove,
            onHarvest,
          },
        }}
        // localeText={{
        //   columnHeaderSortIconLabel: t('common.table.sort', { ns: 'common' }),
        //   footerTotalVisibleRows: (visibleCount, totalCount) =>
        //     t('common.table.rows-out-of', {
        //       visibleCount: visibleCount.toLocaleString(),
        //       totalCount: totalCount.toLocaleString() + '1',
        //     }),
        // }}
      />
    </Root>
  );
}
