import { TFunction } from 'next-i18next';

import { GridColDef } from '@mui/x-data-grid';

import { formatGridDateTime, formatGridUSD } from '@/lib/formatters';

const getColumns = (t: TFunction): GridColDef[] => {
  return [
    {
      field: 'date',
      sortable: true,
      valueFormatter: formatGridDateTime,
      flex: 2,
    },
    {
      field: 'totalFees',
      i18nKey: 'total-fees',
      sortable: true,
      valueFormatter: formatGridUSD,
    },
  ].map(({ i18nKey, ...restOfFields }) => ({
    flex: 1,
    headerName: t(`platform-section.fields.${i18nKey || restOfFields.field}`),
    minWidth: 200,
    ...restOfFields,
  })) as GridColDef[];
};

export default getColumns;
