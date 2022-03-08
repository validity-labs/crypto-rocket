import { useMemo, useState, useEffect, useCallback } from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridRowsProp, GridSortModel } from '@mui/x-data-grid';

import { TABLE_ROWS_PER_PAGE, TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import loadData from '@/app/data';
import DataGrid from '@/components/general/DataGrid/DataGrid';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import Label from '@/components/general/Label/Label';
import Search from '@/components/general/Search/Search';
import Switch from '@/components/general/Switch/Switch';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
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
    '.aside': {
      display: 'flex',
      alignItems: 'center',
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

export default function AssetSection(/* { total }: Props */) {
  const t = usePageTranslation();
  const [toggle, setToggle] = useState(false);
  const [term, setTerm] = useState<string | null>(null);
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
      const { total, records } = await loadData('earn-deposit', {
        page: rowsState.page,
        pageSize: rowsState.pageSize,
        sort: sortModel,
        term,
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
  }, [sortModel, rowsState, term /* data */]);

  const handleSearch = useCallback(
    (newTerm: string) => {
      if (term !== newTerm) {
        setTerm(newTerm);
        setRowsState((prevRowsState) => ({ ...prevRowsState, page: 1 }));
      }
    },
    [term]
  );
  return (
    <Section>
      <Panel>
        <div className="header">
          <Label id="marketTotalSize" className="label" tooltip={t(`asset-section.title-hint`)}>
            {t(`asset-section.title`)}
          </Label>
          <div className="aside">
            <Switch checked={toggle} setChecked={setToggle} sx={{ mr: 4.5 }} title={t(`asset-section.toggle-hint`)} />
            <Search onSearch={handleSearch} />
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
