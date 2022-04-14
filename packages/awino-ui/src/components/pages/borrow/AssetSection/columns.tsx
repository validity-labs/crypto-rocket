import { TFunction, Trans } from 'next-i18next';

import { Typography } from '@mui/material';
import { GridColDef, /* GridColumnHeaderParams, */ GridRenderCellParams } from '@mui/x-data-grid';

import { formatGridPercent, formatGridUSD } from '@/lib/formatters';

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
      field: 'availableToBorrow',
      i18nKey: 'available-to-borrow',
      sortable: true,
      valueFormatter: formatGridUSD,
      renderHeader: (/* params: GridColumnHeaderParams */) => {
        return (
          <div className="MuiDataGrid-columnHeaderTitle">
            <Typography>
              <Trans
                i18nKey="asset-section.fields.available-to-borrow"
                t={t}
                components={{ hint: <span key="span" className="hint" /> }}
              />
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'apy',
      sortable: true,
      valueFormatter: formatGridPercent,
    },
    {
      field: 'utilization',
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
