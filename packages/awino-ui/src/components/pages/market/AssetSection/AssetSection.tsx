import { useMemo } from 'react';

import { TFunction } from 'next-i18next';

import { alpha, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid as MuiDataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import Label from '@/components/general/Label/Label';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { formatAmount } from '@/lib/formatters';
import { StatsData } from '@/types/pages/landing';

import StatsItems from '../../shared/StatsItems/StatsItems';

const getColumns = (t: TFunction): GridColDef[] => {
  return [
    { field: 'asset', sortable: true },
    { field: 'marketSize', i18nKey: 'market-size', sortable: true },
    { field: 'totalBorrowed', i18nKey: 'total-borrowed', sortable: true },
    { field: 'depositAPY', i18nKey: 'deposit-apy', sortable: true, align: 'right', headerAlign: 'center' },
    {
      field: 'borrowAPY',
      i18nKey: 'borrow-apy',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,

      // width: 160,
      renderCell: (params: GridRenderCellParams) => <Typography>{params.value}</Typography>,
    },
  ].map(({ i18nKey, ...restOfFields }) => ({
    ...restOfFields,
    flex: 1,
    headerName: t(`asset-section.fields.${i18nKey || restOfFields.field}`),
  }));
};

const rows = new Array(20)
  .fill({
    asset: 'dai',
    marketSize: null,
    totalBorrow: 3.38,
    depositAPY: 1.5,
    borrowAPY: 6.83,
  })
  .map((m, index) => ({ id: index, ...m }));

const Root = styled(Section)(({ theme }) => ({}));

const Panel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  // alignItems: 'flex-start',
  // maxWidth: '420px',
  // padding: theme.spacing(13, 7),
  // margin: '0 auto',
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
  '.MuiDataGrid-iconButtonContainer': {
    marginLeft: theme.spacing(3),
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
    padding: theme.spacing(4.5, 5, 4),
  },
  '.MuiDataGrid-footerContainer': {
    border: 0,
  },
}));

interface Props {
  items: StatsData;
  total: {
    market: number;
    platform: number;
  };
}
export default function AssetSection({ total, items }: Props) {
  const t = usePageTranslation();
  const columns = useMemo(() => {
    return getColumns(t);
  }, [t]);
  return (
    <Root>
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
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={8}
              rowsPerPageOptions={[8]}
              disableColumnMenu /* checkboxSelection */
              sortingMode="server"
            />
          </div>
        </div>
      </Panel>
    </Root>
  );
}

// import * as React from 'react';
// import { DataGridPro } from '@mui/x-data-grid-pro';
// import { useDemoData, getRealGridData, getCommodityColumns } from '@mui/x-data-grid-generator';
// import LinearProgress from '@mui/material/LinearProgress';

// const MAX_ROW_LENGTH = 500;

// function sleep(duration: number) {
//   return new Promise<void>((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, duration);
//   });
// }

// export default function InfiniteLoadingGrid() {
//   const [loading, setLoading] = React.useState(false);
//   const [loadedRows, setLoadedRows] = React.useState<any>([]);
//   const mounted = React.useRef(true);
//   const { data } = useDemoData({
//     dataSet: 'Commodity',
//     rowLength: 20,
//     maxColumns: 6,
//   });

//   const loadServerRows = async (newRowLength) => {
//     setLoading(true);
//     const newData = await getRealGridData(newRowLength, getCommodityColumns());
//     // Simulate network throttle
//     await sleep(Math.random() * 500 + 100);

//     if (mounted.current) {
//       setLoading(false);
//       setLoadedRows(loadedRows.concat(newData.rows));
//     }
//   };

//   const handleOnRowsScrollEnd = (params) => {
//     if (loadedRows.length <= MAX_ROW_LENGTH) {
//       loadServerRows(params.viewportPageSize);
//     }
//   };

//   React.useEffect(() => {
//     return () => {
//       mounted.current = false;
//     };
//   }, []);

//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGridPro
//         {...data}
//         rows={data.rows.concat(loadedRows)}
//         loading={loading}
//         hideFooterPagination
//         onRowsScrollEnd={handleOnRowsScrollEnd}
//         components={{
//           LoadingOverlay: LinearProgress,
//         }}
//       />
//     </div>
//   );
// }
