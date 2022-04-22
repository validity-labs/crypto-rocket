import { alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';

const DataGrid = styled(MuiDataGrid)(({ theme }) => ({
  '&.MuiDataGrid-root': {
    border: 0,
  },
  '.MuiDataGrid-columnHeaderTitle': {
    ...theme.typography.body,
    fontWeight: 500,
    color: theme.palette.text.secondary,
    whiteSpace: 'pre-line',
    span: {
      ...theme.typography['body-xs'],
    },
  },
  '.MuiDataGrid-columnHeaderTitleContainer': {
    // alignItems: 'flex-start',
  },
  '.MuiDataGrid-columnHeaderTitleContainerContent': {},
  '.MuiDataGrid-columnHeaders': {
    // alignItems: 'flex-start',
    borderBottom: 0,
  },
  '.MuiDataGrid-columnSeparator': {
    display: 'none',
  },
  '.MuiDataGrid-iconButtonContainer': {
    marginLeft: theme.spacing(3),
    visibility: 'visible',
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
    // padding: theme.spacing(4.5, 5, 4),
    padding: theme.spacing(0, 5, 0),
    '&:focus-within': {
      outline: 'none',
    },
  },
  '.MuiDataGrid-cellContent': {
    ...theme.typography.body,
    fontWeight: 500,
    color: theme.palette.text.primary,
    '&.MuiDataGrid-cell--asset': {
      display: 'flex',
      alignItems: 'center',
      textTransform: 'uppercase',
      img: {
        width: 36,
        height: 36,
        marginRight: theme.spacing(6),
        borderRadius: '100%',
      },
    },
    '&.MuiDataGrid-cellContent--withApr': {
      display: 'flex',
      flexDirection: 'column',
    },
    '.MuiDataGrid-cellText': {
      ...theme.typography.body,
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
  },
  '.MuiDataGrid-footerContainer': {
    border: 0,
  },
}));

export default DataGrid;
