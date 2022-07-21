import { TFunction } from 'next-i18next';

import { Box, Tooltip, Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { SYMBOLS } from '@/app/constants';
import ExpandIcon from '@/components/icons/ExpandIcon';
import InfoIcon from '@/components/icons/InfoIcon';
import AssetIcons from '@/components/pages/swap/SwapSection/AssetIcons';
import { formatGridPercent, formatGridUSD, formatLPPair, formatPercent } from '@/lib/formatters';
import { AssetKeyPair } from '@/types/app';

const getColumns = (t: TFunction): GridColDef[] => {
  return [
    {
      field: 'details',
      i18nKey: 'details',
      minWidth: 40,
      renderCell: (params: GridRenderCellParams) => (
        <ExpandIcon fontSize="small" /* sx={{ transform: `rotate(${params.value ? 0 : -90}deg)` }} */ />
      ),
      headerName: '',
    },
    {
      field: 'pair',
      i18nKey: 'asset',
      renderCell: (params: GridRenderCellParams) => {
        const pair = [params.value.first, params.value.second] as AssetKeyPair;
        return (
          <div className="Awi-row AwiResultTable-columnAsset">
            {/* @ts-expect-error */}
            <AssetIcons ids={pair} size="medium" component="div" />
            <Typography className="AwiResultTable-pair">{formatLPPair(pair)}</Typography>
          </div>
        );
      },
      valueGetter: (params) => ({ first: params.row.pair[0], second: params.row.pair[1] }),
    },
    {
      field: 'earn',
      i18nKey: 'earn',
      valueFormatter: () => SYMBOLS.AWINO,
    },
    {
      field: 'multiplier',
      i18nKey: 'emissions',
    },
    {
      field: 'totalValueOfLiquidityPoolUSD',
      i18nKey: 'total-liquidity',
      valueFormatter: formatGridUSD,
    },
    // {
    //   field: 'aprRange',
    //   i18nKey: 'apr-range',
    //   renderCell: (params: GridRenderCellParams) => (
    //     <Box component="span" display="flex" justifyContent="flex-end" alignItems="center">
    //       {`${formatPercent(params.value.from)} - ${formatPercent(params.value.to)}`}
    //       <Tooltip
    //         className="AwiResultTable-tooltip"
    //         title={t('apr-range-hint', { v1: params.row.aprFarm, v2: params.row.aprLP })}
    //       >
    //         <Box component="span" ml={2.5} display="flex">
    //           <InfoIcon fontSize="small" />
    //         </Box>
    //       </Tooltip>
    //     </Box>
    //   ),
    //   valueGetter: (params) => ({ from: params.row.aprRange[0], to: params.row.aprRange[1] }),
    // },
    {
      field: 'apr',
      i18nKey: 'apr',
      valueFormatter: formatGridPercent,
    },
    {
      field: 'depositFee',
      i18nKey: 'deposit-fee',
      valueFormatter: formatGridPercent,
      valueGetter: () => 0,
    },
  ].map(({ i18nKey, ...restOfFields }) => ({
    editable: false,
    flex: 1,
    sortable: false,
    headerName: t(`fields.${i18nKey || restOfFields.field}`),
    minWidth: 200,
    ...restOfFields,
  })) as GridColDef[];
};

export default getColumns;
