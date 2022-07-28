import { useMemo } from 'react';

import { styled } from '@mui/material/styles';

import { TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import DataGrid from '@/components/general/DataGrid/DataGrid';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AssetKeyPair } from '@/types/app';

import getColumns from './columns';
import GridRow from './GridRow';
import { FarmItem } from './ResultSection';

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  height: 888 /* 66 * 10 + 12 * 10 - 12 */,
  width: '100%',
  '.AwiResultTable-pair': {
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
  '.MuiDataGrid-row': {
    backgroundColor: 'unset',
    '&:not(:last-child)': {
      margin: `0 !important`,
    },
  },
}));

interface Props {
  loading: boolean;
  items: FarmItem[];
  onHarvest: (item: FarmItem) => void;
  onStake: (item: FarmItem) => void;
  onUnstake: (item: FarmItem) => void;
}

export default function ResultTable({ loading, onHarvest, onStake, onUnstake, items }: Props) {
  const t = usePageTranslation({ keyPrefix: 'result-section' });
  const columns = useMemo(() => {
    return getColumns(t);
  }, [t]);
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
        // pagination
        paginationMode="client"
        components={{
          Pagination: GridPagination,
          Row: GridRow,
        }}
        componentsProps={{
          row: {
            onStake,
            onUnstake,
            onHarvest,
          },
        }}
      />
    </Root>
  );
}
