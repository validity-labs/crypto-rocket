import { TFunction } from 'next-i18next';

import { Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { PlainSwitch } from '@/components/general/Switch/Switch';
import DataGridSwitch from '@/components/grid/DataGridSwitch/DataGridSwitch';
import { formatGridEmptyString, formatGridPercent } from '@/lib/formatters';
import { AssetKey } from '@/types/app';

import { CollateralModalData } from './CollateralModal';

type CollateralCallback = (data: CollateralModalData) => void;
interface GetColumnsOptions {
  collateralCallback: CollateralCallback;
}

const getColumns = (t: TFunction, { collateralCallback }: GetColumnsOptions): GridColDef[] => {
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
    {
      field: 'collateral',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => {
        const handleCallback = (newValue: boolean) => {
          collateralCallback({ asset: params.row.asset as AssetKey, stage: newValue ? 'enable' : 'disable' });
        };

        return <DataGridSwitch value={params.value} callback={handleCallback} />;
      },
    },
  ].map(({ i18nKey, ...restOfFields }) => ({
    ...restOfFields,
    flex: 1,
    headerName: t(`fields.${i18nKey || restOfFields.field}`),
    minWidth: 200,
  })) as GridColDef[];
};

export default getColumns;
