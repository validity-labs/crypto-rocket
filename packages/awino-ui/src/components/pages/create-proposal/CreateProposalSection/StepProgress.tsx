import { StepProgressBar } from 'react-stepz';

import { styled } from '@mui/material/styles';

const StepProgress = styled(StepProgressBar)(({ theme }) => ({
  ul: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(0, 0, 2),
    overflowX: 'auto',
    '::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.grey[400],
      borderRadius: '6px',
    },
  },
  li: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minWidth: 80,
    '&:not(:last-of-type):after': {
      content: '""',
      position: 'absolute',
      top: 15,
      right: -6,
      height: 2,
      width: 12,
      borderRadius: 2,
      backgroundColor: '#EFF4FF',
    },
    'span:first-of-type': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: 32,
      height: 32,
      padding: 0,
      margin: theme.spacing(0, 0, 4),
      borderRadius: '100%',
      ...theme.typography['body-xl'],
      lineHeight: 1,
      fontWeight: 600,
      color: theme.palette.background.light,
      background: '#EFF4FF', // 'rgba(24, 37, 44, 0.32)',
      transition: 'all 500ms ease-in-out',
    },
    'span:last-of-type': {
      ...theme.typography['body'],
      fontWeight: 600,
      color: theme.palette.text.primary,
      transition: 'all 500ms ease-in-out',
    },
    '&.active': {
      'span:first-of-type': {
        background: theme.palette.text.active, //'#18252c',
        transition: 'all 500ms ease-in-out',
      },
      'span:last-of-type': {
        // color: theme.palette.text.secondary,
        transition: 'all 500ms ease-in-out',
      },
    },
    '&.error': {
      'span:first-of-type': {
        animation: 'headShake 1s ease-in-out',
        transition: 'all 500ms ease-in-out',
        background: theme.palette.error.light,
      },
    },
    '&.completed': {
      'span:first-of-type': {
        background: '#9ADE8E',
        transition: 'all 500ms ease-in-out',
        svg: {
          width: '22px',
        },
      },
      '&:not(:last-of-type):after': {
        backgroundColor: theme.palette.text.primary,
        transition: 'all 500ms ease-in-out',
      },
    },
  },
  [theme.breakpoints.up('md')]: {
    li: {
      minWidth: 126,
      '&:not(:last-of-type):after': {
        top: 32,
        right: -30,
        height: 2,
        width: 60,
      },
      'span:first-of-type': {
        width: 66,
        height: 66,
        padding: theme.spacing(1, 0, 0),
        // ...theme.typography['body-sm'],
      },
      'span:last-of-type': {
        // ...theme.typography['body-xs'],
        // fontWeight: 700,
      },
    },
  },
}));

export default StepProgress;
