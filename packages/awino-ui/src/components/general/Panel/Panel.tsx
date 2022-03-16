import clsx from 'clsx';

import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const Panel = styled(({ className, ...restOfProps }: BoxProps) => (
  <Box className={clsx(className, 'AwiPanel-root')} {...restOfProps} />
))(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: +theme.shape.borderRadius * 5,
  backgroundColor: theme.palette.background.transparent,
  '.header': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(10),
    padding: theme.spacing(5.5, 6.5, 5),
    margin: theme.spacing(0, 0, 10, 0),
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
    '.aside': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  '.content': {
    padding: theme.spacing(4, 5, 10),
    '.table-container': {
      height: 888 /* 66 * 10 + 12 * 10 - 12 */,
      width: '100%',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.header': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(18),
      padding: theme.spacing(5.5, 12.5, 5),
    },
    '.content': {
      padding: theme.spacing(4, 12.5, 10),
    },
  },
}));

export default Panel;
