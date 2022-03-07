import { TFunction } from 'next-i18next';

import { Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { formatGridEmptyString, formatGridPercent } from '@/lib/formatters';
import { renderCellWithAPR } from '@/lib/grid';

const getColumns = (t: TFunction): GridColDef[] => {
  return [
    {
      field: 'asset',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography className="MuiDataGrid-cellContent MuiDataGrid-cell--asset">
          <img src={`/images/assets/${params.value}.svg`} alt="" />
          {params.id} {params.value}
        </Typography>
      ),
    },
    {
      field: 'marketSize',
      i18nKey: 'market-size',
      sortable: true,
      valueFormatter: formatGridEmptyString,
    },
    {
      field: 'totalBorrowed',
      i18nKey: 'total-borrowed',
      sortable: true,
      valueFormatter: formatGridPercent,
    },
    {
      field: 'depositAPY',
      i18nKey: 'deposit-apy',
      sortable: true,
      renderCell: renderCellWithAPR,
    },
    {
      field: 'borrowAPY',
      i18nKey: 'borrow-apy',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      renderCell: renderCellWithAPR,
    },
  ].map(({ i18nKey, ...restOfFields }) => ({
    ...restOfFields,
    flex: 1,
    headerName: t(`asset-section.fields.${i18nKey || restOfFields.field}`),
    minWidth: 200,
  })) as GridColDef[];
};

export default getColumns;
