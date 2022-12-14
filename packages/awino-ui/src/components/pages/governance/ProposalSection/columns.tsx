import { TFunction } from 'next-i18next';

import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import {
  AVERAGE_BLOCK_TIME_IN_SECS,
  DEFAULT_DATE_TIME_FORMAT,
  DEFAULT_DATE_TIME_PRETTY_FORMAT,
  SYMBOLS,
} from '@/app/constants';
import { ProposalState } from '@/app/constants';
import dateIO from '@/app/dateIO';
import ExpandIcon from '@/components/icons/ExpandIcon';
import InfoIcon from '@/components/icons/InfoIcon';
import AssetIcons from '@/components/pages/swap/SwapSection/AssetIcons';
import { formatGridPercent, formatGridUSD, formatLPPair, formatPercent } from '@/lib/formatters';
import { AssetKeyPair } from '@/types/app';

import ProposalStatus from './ProposalStatus';

interface GetColumnsProps {
  currentBlock: number;
}
const getColumns = (t: TFunction, { currentBlock }: GetColumnsProps): GridColDef[] => {
  return [
    {
      field: 'id',
      i18nKey: 'id',
      minWidth: 40,
      flex: 0,
      renderCell: (params: GridRenderCellParams) => (
        <Chip variant="outlined" label={params.value} color="default" size="small" />
      ),
    },
    {
      field: 'title',
      i18nKey: 'title',
      flex: 1,
    },
    {
      field: 'date',
      i18nKey: 'date',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const now = new Date();
        let startDate;
        let endDate;
        console.log(params.row);
        if (now && currentBlock) {
          startDate = dateIO.addSeconds(now, AVERAGE_BLOCK_TIME_IN_SECS * (params.row.startBlock - currentBlock));
          endDate =
            params.row.endBlock &&
            dateIO.addSeconds(now, AVERAGE_BLOCK_TIME_IN_SECS * (params.row.endBlock - currentBlock));
        }

        let date = endDate;
        let i18nKey = 'voting-ends-at';
        console.log(startDate, endDate);
        if (startDate && !endDate) {
          date = startDate;
          i18nKey = 'voting-starts-at';
        } else if (endDate && dateIO.isBefore(endDate, now)) {
          i18nKey = 'voting-ended-at';
        }

        return t(i18nKey, { date: dateIO.formatByString(date, DEFAULT_DATE_TIME_PRETTY_FORMAT) });
      },
    },
    {
      field: 'status',
      i18nKey: 'status',
      // flex: 1,
      minWidth: 'auto',
      renderCell: (params: GridRenderCellParams<ProposalState>) => <ProposalStatus status={params.value} />,
      align: 'right',
    },
    // {
    //   field: 'details',
    //   i18nKey: 'details',
    //   minWidth: 40,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <ExpandIcon fontSize="small" /* sx={{ transform: `rotate(${params.value ? 0 : -90}deg)` }} */ />
    //   ),
    //   headerName: '',
    // },
    // {
    //   field: 'pair',
    //   i18nKey: 'asset',
    //   renderCell: (params: GridRenderCellParams) => {
    //     const pair = [params.value.first, params.value.second] as AssetKeyPair;
    //     return (
    //       <div className="Awi-row AwiResultTable-columnAsset">
    //         {/* @ts-expect-error */}
    //         <AssetIcons ids={pair} size="medium" component="div" />
    //         <Typography className="AwiResultTable-pair">{formatLPPair(pair)}</Typography>
    //       </div>
    //     );
    //   },
    //   valueGetter: (params) => ({ first: params.row.pair[0], second: params.row.pair[1] }),
    // },
    // {
    //   field: 'earn',
    //   i18nKey: 'earn',
    //   valueFormatter: () => SYMBOLS.AWINO,
    // },
    // {
    //   field: 'proportion',
    //   i18nKey: 'emissions',
    //   valueFormatter: formatGridPercent,
    // },
    // {
    //   field: 'liquidity',
    //   i18nKey: 'total-liquidity',
    //   valueFormatter: formatGridUSD,
    // },
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
    // {
    //   field: 'apr',
    //   i18nKey: 'apr',
    //   valueFormatter: formatGridPercent,
    // },
    // {
    //   field: 'depositFee',
    //   i18nKey: 'deposit-fee',
    //   valueFormatter: formatGridPercent,
    // },
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
