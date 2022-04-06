import { useMemo, useState, useEffect, useCallback } from 'react';

import { useRouter } from 'next/router';

import { GridEventListener, GridEvents, GridRowsProp, GridSortModel } from '@mui/x-data-grid';

import { TABLE_ROWS_PER_PAGE, TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import loadData from '@/app/data';
import DataGrid from '@/components/general/DataGrid/DataGrid';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import Label from '@/components/general/Label/Label';
import Panel from '@/components/general/Panel/Panel';
import Search from '@/components/general/Search/Search';
import Switch from '@/components/general/Switch/Switch';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AssetKey, RowsState } from '@/types/app';

import CollateralModal, { CollateralModalData } from './CollateralModal';
import getColumns from './columns';
export interface CollateralInfo {
  borrowLimit: [number, number];
  borrowLimitUsed: [number, number];
}

export default function AssetSection(/* { total }: Props */) {
  const t = usePageTranslation();
  const router = useRouter();
  const [collateralInfo, setCollateralInfo] = useState<CollateralInfo>({
    borrowLimit: [0, 0],
    borrowLimitUsed: [0, 0],
  });
  const [collateralModal, setCollateralModal] = useState<CollateralModalData | null>(null);
  const [toggle, setToggle] = useState(false);
  const [term, setTerm] = useState<string>('');
  const columns = useMemo(() => {
    return getColumns(t, {
      collateralCallback: (data: CollateralModalData) => {
        setCollateralModal(data);
      },
    });
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
      setCollateralInfo({
        borrowLimit: [1.03, 1.03],
        borrowLimitUsed: [0, 0],
      });
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

  const handleRowClick: GridEventListener<GridEvents.rowClick> = useCallback(
    (props) => {
      router.push(`/earn/deposit/${props.row.asset}`);
    },
    [router]
  );

  const handleCellClick: GridEventListener<GridEvents.cellClick> = useCallback((props, event, details) => {
    const { field } = props;
    if (field === 'collateral') {
      event.stopPropagation();
    }
    // router.push(`/earn/deposit/${props.row.asset}`);
  }, []);

  const handleCollateralToggle = (asset: AssetKey) => {
    setRows((prevRows) =>
      prevRows.map((r) => {
        if (r.asset === asset) {
          return { ...r, collateral: !r.collateral };
        }
        return r;
      })
    );
  };

  return (
    <>
      <Section>
        <Panel
          header={
            <>
              <Label
                id="earnDepositTitle"
                tooltip={t(`asset-section.title-hint`)}
                variant="h4"
                component="h2"
                color="text.active"
              >
                {t(`asset-section.title`)}
              </Label>
              <div className="aside">
                <Switch
                  checked={toggle}
                  setChecked={setToggle}
                  sx={{ mr: 4.5 }}
                  title={t(`asset-section.toggle-hint`)}
                />
                <Search onSearch={handleSearch} />
              </div>
            </>
          }
        >
          {/* {connected ? ( */}
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
              onCellClick={handleCellClick}
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
          {/* ) : (
            <ConnectPanel />
          )} */}
        </Panel>
      </Section>
      {!!collateralModal && (
        <CollateralModal
          open={!!collateralModal}
          close={() => setCollateralModal(null)}
          data={collateralModal}
          info={collateralInfo}
          callback={handleCollateralToggle}
        />
      )}
    </>
  );
}
