import { useMemo, useState, useEffect } from 'react';

import { alpha, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid as MuiDataGrid, GridRowsProp, GridSortModel } from '@mui/x-data-grid';

import { TABLE_ROWS_PER_PAGE, TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import loadData from '@/app/data';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import Label from '@/components/general/Label/Label';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount } from '@/lib/formatters';
import { RowsState } from '@/types/app';
import { TotalAssetSize } from '@/types/pages/market';

import getColumns from './columns';

const Panel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: +theme.shape.borderRadius * 5,
  backgroundColor: theme.palette.background.transparent,
  '.header': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(10),
    padding: theme.spacing(5.5, 6.5, 5),
    margin: theme.spacing(0, 0, 15, 0),
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
  },
  '.content': {
    padding: theme.spacing(4, 12.5, 10),
    '.table-container': {
      height: 888 /* 66 * 10 + 12 * 10 - 12 */,
      width: '100%',
    },
  },
  '.label-value-pair': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '100%',
    '.label': {
      margin: theme.spacing(0, 0, 4.5),
      overflow: 'auto',
    },
    '.value': {
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'auto',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.header': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(18),
      padding: theme.spacing(5.5, 12.5, 5),
    },
    '.label-value-pair': {
      flexDirection: 'row',
      flexWrap: 'wrap',
      '.label': {
        margin: theme.spacing(0, 6.5, 0, 0),
      },
    },
  },
}));

const DataGrid = styled(MuiDataGrid)(({ theme }) => ({
  '&.MuiDataGrid-root': {
    border: 0,
  },
  '.MuiDataGrid-columnHeaderTitle': {
    ...theme.typography.body,
    color: theme.palette.text.secondary,
  },
  '.MuiDataGrid-columnHeaders': {
    borderBottom: 0,
  },
  '.MuiDataGrid-columnSeparator': {
    display: 'none',
  },
  '.MuiDataGrid-iconButtonContainer': {
    marginLeft: theme.spacing(3),
    visibility: 'visible',
  },
  '.MuiDataGrid-sortIcon': {
    opacity: '1 !important',
  },
  '.MuiDataGrid-row': {
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
    '&:not(:last-child)': {
      margin: theme.spacing(0, 0, 3, 0),
    },
    '&.Mui-selected, &:hover, &.Mui-selected:hover': {
      backgroundColor: alpha('#00FFEB', 0.1),
    },
  },
  '.MuiDataGrid-cell': {
    border: 0,
    // padding: theme.spacing(4.5, 5, 4),
    padding: theme.spacing(0, 5, 0),
  },
  '.MuiDataGrid-cellContent': {
    ...theme.typography.body,
    fontWeight: 500,
    color: theme.palette.text.primary,
    '&.MuiDataGrid-cell--asset': {
      display: 'flex',
      alignItems: 'center',
      textTransform: 'uppercase',
      img: {
        width: 36,
        height: 36,
        marginRight: theme.spacing(6),
        borderRadius: '100%',
      },
    },
    '&.MuiDataGrid-cellContent--withApr': {
      display: 'flex',
      flexDirection: 'column',
    },
    '.MuiDataGrid-cellText': {
      ...theme.typography.body,
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
  },
  '.MuiDataGrid-footerContainer': {
    border: 0,
  },
}));

interface Props {
  total: TotalAssetSize;
}

export default function AssetSection({ total }: Props) {
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

  return (
    <Section>
      <Panel>
        <div className="header">
          <div className="label-value-pair">
            <Label id="marketTotalSize" className="label" tooltip={t(`asset-section.market.total-size-hint`)}>
              {t(`asset-section.market.total-size`)}
            </Label>
            <Typography variant="h5" component="p" className="value" aria-describedby="marketTotalSize">
              {formatAmount(total.market)}
            </Typography>
          </div>
          <div className="label-value-pair">
            <Label id="platformTotalFee" className="label" tooltip={t(`asset-section.platform.total-fee-hint`)}>
              {t(`asset-section.platform.total-fee`)}
            </Label>
            <Typography variant="h5" component="p" className="value" aria-describedby="platformTotalFee">
              {formatAmount(total.platform)}
            </Typography>
          </div>
        </div>
        <div className="content">
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
        </div>
      </Panel>
    </Section>
  );
}
