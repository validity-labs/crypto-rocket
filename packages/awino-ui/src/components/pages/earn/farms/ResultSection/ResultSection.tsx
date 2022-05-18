import { useMemo, useState, useEffect, useCallback } from 'react';

import { useRouter } from 'next/router';

import { FormControlLabel, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridEventListener, GridEvents, GridRowsProp, GridSortModel } from '@mui/x-data-grid';

import { TABLE_ROWS_PER_PAGE, TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import loadData from '@/app/data';
import DataGrid from '@/components/general/DataGrid/DataGrid';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import Label from '@/components/general/Label/Label';
import Panel from '@/components/general/Panel/Panel';
import Search from '@/components/general/Search/Search';
import Select from '@/components/general/Select/Select';
import Switch from '@/components/general/Switch/Switch';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AssetKey, RowsState } from '@/types/app';

// import CollateralModal, { CollateralModalData } from './CollateralModal';
// import getColumns from './columns';
// import OperationModal, { OperationModalData } from './OperationModal';

const Root = styled(Section)(({ theme }) => ({
  '.AwiResultSection-toggle': {
    margin: theme.spacing(4.5, 0, 7.5),
    '.MuiFormControlLabel-label': {
      fontWeight: 500,
    },
  },
  [theme.breakpoints.up('md')]: {},
}));

export interface CollateralInfo {
  borrowLimit: [number, number];
  borrowLimitUsed: [number, number];
}

type FarmTypeKey = 'all' | 'standard' | 'boosted' | 'winawi';
const SORT_BY_ITEMS = ['emissions', 'apr', 'earned', 'liquidity', 'fees'];

export default function ResultSection(/* { total }: Props */) {
  const t = usePageTranslation({ keyPrefix: 'result-section' });
  const router = useRouter();
  const [collateralInfo, setCollateralInfo] = useState<CollateralInfo>({
    borrowLimit: [0, 0],
    borrowLimitUsed: [0, 0],
  });
  // const [collateralModal, setCollateralModal] = useState<CollateralModalData | null>(null);
  // const [operationModal, setOperationModal] = useState<OperationModalData | null>(null);
  const [toggle, setToggle] = useState(false);
  const [term, setTerm] = useState<string>('');

  const sortByItems = useMemo(() => {
    return SORT_BY_ITEMS.reduce((ar, r) => {
      ar.set(r, { id: r, label: t(`sort-by.value.${r}`) });
      return ar;
    }, new Map());
  }, [t]);
  console.log(sortByItems);
  // const columns = useMemo(() => {
  //   return getColumns(t, {
  //     collateralCallback: (data: CollateralModalData) => {
  //       setCollateralModal(data);
  //     },
  //   });
  // }, [t]);

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

  const handleRowClick: GridEventListener<GridEvents.rowClick> = useCallback((props) => {
    const { asset, enabled } = props.row;
    // setOperationModal({ asset, enabled });
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

  const [type, setType] = useState<FarmTypeKey>('all');

  const handleType = (event: React.MouseEvent<HTMLElement>, newType: FarmTypeKey) => {
    setType(newType);
    // setCanExecute((prev) => !prev);
  };

  return (
    <>
      <Root>
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
                <Select items={sortByItems} value="emissions" setValue={() => {}} />
                <Search onSearch={handleSearch} />
              </div>
            </>
          }
        >
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleType}
            aria-label={t(`type.title`)}
            className="AwiAssetSection-toggle"
          >
            <ToggleButton value="all">{t('type.value.all')}</ToggleButton>
            <ToggleButton value="standard">{t('type.value.standard')}</ToggleButton>
            <ToggleButton value="boosted">{t('type.value.boosted')}</ToggleButton>
            <ToggleButton value="winawi">{t('type.value.winawi')}</ToggleButton>
          </ToggleButtonGroup>
          <div className="AwiResultSection-toggle">
            <FormControlLabel
              sx={{ ml: 0 }}
              control={<Switch checked={toggle} setChecked={setToggle} sx={{ ml: 4.5 }} />}
              labelPlacement="start"
              label={t(`staked-only`) as string}
            />
          </div>
          <div className="AwiResultSection-toggle">
            <FormControlLabel
              sx={{ ml: 0 }}
              control={<Switch checked={toggle} setChecked={setToggle} sx={{ ml: 4.5 }} />}
              labelPlacement="start"
              label={t(`inactive-farms`) as string}
            />
          </div>
          {/* {connected ? ( */}
          <div className="table-container">
            {/* <DataGrid
              loading={loading}
              // columns={columns}
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
            /> */}
          </div>
          {/* ) : (
            <ConnectPanel />
          )} */}
        </Panel>
      </Root>
      {/* {!!collateralModal && (
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
      )} */}
    </>
  );
}
