import { TFunction } from 'next-i18next';

import { Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { formatGridEmptyString, formatGridPercent } from '@/lib/formatters';

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
      field: 'walletBalance',
      i18nKey: 'wallet-balance',
      sortable: true,
      valueFormatter: formatGridEmptyString,
    },
    {
      field: 'apy',
      sortable: true,
      valueFormatter: formatGridPercent,
    },
  ].map(({ i18nKey, ...restOfFields }) => ({
    ...restOfFields,
    flex: 1,
    headerName: t(`asset-section.fields.${i18nKey || restOfFields.field}`),
    minWidth: 200,
  })) as GridColDef[];
};

export default getColumns;
