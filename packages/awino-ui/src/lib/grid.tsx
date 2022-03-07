import { Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';

import APRBadge from '@/components/badges/APRBadge/APRBadge';

import { formatGridPercent } from './formatters';

export const renderCellWithAPR = (params: Pick<GridRenderCellParams, 'value'>) => (
  <div className="MuiDataGrid-cellContent MuiDataGrid-cellContent--withApr">
    <Typography className="MuiDataGrid-cellText">{formatGridPercent(params)}</Typography>
    {/* TODO WIP When APR calculation logic is clear apply */}
    <APRBadge value={+params.value} />
  </div>
);
