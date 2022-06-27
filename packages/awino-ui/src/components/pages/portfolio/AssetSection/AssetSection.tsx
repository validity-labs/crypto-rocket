import { useMemo, useState, useEffect, useCallback } from 'react';

import { useRouter } from 'next/router';

import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridEventListener, GridEvents, GridRowsProp, GridSortModel } from '@mui/x-data-grid';

import { TABLE_ROWS_PER_PAGE, TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import loadData from '@/app/data';
import DataGrid from '@/components/general/DataGrid/DataGrid';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AssetKey, RowsState } from '@/types/app';

import CollateralModal, { CollateralModalData } from './CollateralModal';
import getColumns from './columns';
import OperationModal, { OperationModalData } from './OperationModal';

const Root = styled(Section)(({ theme }) => ({
  '.AwiAssetSection-toggle': {
    marginBottom: theme.spacing(6),
    backgroundColor: 'transparent',
  },

  '.AwiPanel-root .AwiAssetSection-title': {
    fontWeight: 500,
    color: theme.palette.text.primary,
  },

  [theme.breakpoints.up('md')]: {},
}));

export interface CollateralInfo {
  borrowLimit: [number, number];
  borrowLimitUsed: [number, number];
}

export type PortfolioAssetTypeKey = 'deposit' | 'borrow' /*  | 'reward' */;

export default function AssetSection(/* { total }: Props */) {
  const t = usePageTranslation({ keyPrefix: 'asset-section' });
  const router = useRouter();
  const [type, setType] = useState<PortfolioAssetTypeKey>('deposit');

  const handleType = (event: React.MouseEvent<HTMLElement>, newType: PortfolioAssetTypeKey) => {
    setType(newType);
    // setCanExecute((prev) => !prev);
  };
  const [collateralInfo, setCollateralInfo] = useState<CollateralInfo>({
    borrowLimit: [0, 0],
    borrowLimitUsed: [0, 0],
  });
  const [collateralModal, setCollateralModal] = useState<CollateralModalData | null>(null);
  const [operationModal, setOperationModal] = useState<OperationModalData | null>(null);
  const columns = useMemo(() => {
    return getColumns(t, type, {
      collateralCallback: (data: CollateralModalData) => {
        setCollateralModal(data);
      },
    });
  }, [t, type]);

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
  }, [sortModel, rowsState, type /* data */]);

  const handleRowClick: GridEventListener<GridEvents.rowClick> = useCallback((props) => {
    const { asset, enabled } = props.row;
    setOperationModal({ asset, enabled });
  }, []);

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
      <Root>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handleType}
          aria-label={t(`asset-type-hint`)}
          className="AwiAssetSection-toggle"
        >
          <ToggleButton value="deposit">{t('title.deposit')}</ToggleButton>
          <ToggleButton value="borrow">{t('title.borrow')}</ToggleButton>
        </ToggleButtonGroup>
        <Panel
          header={
            <Typography className="AwiAssetSection-title" variant="body" component="h2">
              {t(`title.${type}`)}
            </Typography>
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
          {/* ) : (
            <ConnectPanel />
          )} */}
        </Panel>
      </Root>
      {!!collateralModal && (
        <CollateralModal
          open={!!collateralModal}
          close={() => setCollateralModal(null)}
          data={collateralModal}
          info={collateralInfo}
          callback={handleCollateralToggle}
        />
      )}
      {!!operationModal && (
        <OperationModal open={!!operationModal} close={() => setOperationModal(null)} data={operationModal} />
      )}
    </>
  );
}
