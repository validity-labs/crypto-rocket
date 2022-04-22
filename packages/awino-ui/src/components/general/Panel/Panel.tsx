import { ReactNode } from 'react';

import clsx from 'clsx';

import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Props extends BoxProps {
  header?: ReactNode;
}
const Panel = styled(({ header, children, className, ...restOfProps }: Props) => (
  <Box className={clsx(className, 'AwiPanel-root')} {...restOfProps}>
    {header && <div className="AwiPanel-header header">{header}</div>}
    <div className="AwiPanel-content content">{children}</div>
  </Box>
))(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: +theme.shape.borderRadius * 5,
  backgroundColor: theme.palette.background.transparent,
  '.header, .AwiPanel-header': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(10),
    padding: theme.spacing(5.5, 6.5, 5),
    // margin: theme.spacing(0, 0, 10, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
    h2: {
      color: theme.palette.text.active,
    },
    // borderRadius: +theme.shape.borderRadius * 5,
    // backgroundColor: theme.palette.background.transparent,
    '.aside': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(18),
    },
  },
  '.content, .AwiPanel-content': {
    padding: theme.spacing(4, 5, 10),
    '.table-container': {
      height: 888 /* 66 * 10 + 12 * 10 - 12 */,
      width: '100%',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.header, .AwiPanel-header': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(18),
      padding: theme.spacing(10.5, 12, 6),
    },
    '.content, .AwiPanel-content': {
      padding: theme.spacing(13, 12, 14),
    },
  },
}));

export default Panel;
