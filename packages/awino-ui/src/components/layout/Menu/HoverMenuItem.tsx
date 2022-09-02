import clsx from 'clsx';

import { styled } from '@mui/material/styles';

interface HoverMenuItemProps {
  children: React.ReactNode;
  className?: string;
  close?: (event: React.SyntheticEvent) => void;
}

const HoverMenuItem = styled(({ close, children, className, ...restOfProps }: HoverMenuItemProps) => {
  return (
    <li onClick={close} className={clsx('AwiHoverMenu-item', className)} {...restOfProps}>
      {children}
    </li>
  );
})(({ theme }) => ({
  '> a, > button': {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(4, 8),
    width: '100%',
    ...theme.typography.menu,
    color: theme.palette.text.menu,
    border: 0,
    boxShadow: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'color backgroundColor 200ms ease-in-out',
    '&.Awi-active, &:hover, &.Mui-focusVisible': {
      backgroundColor: theme.palette.background.transparent,
    },
    '&.Awi-active': {
      color: theme.palette.text.active,
    },
    '&:hover, &.Mui-focusVisible': {
      color: theme.palette.text.primary,
    },
  },
  '&.Mui-focusVisible': {
    outlineOffset: '-2px',
    ouline: '2px solid #00FFEB',
  },
  '&.Awi-dense': {
    'a, button': {
      padding: theme.spacing(2.5, 8),
    },
  },
}));

export default HoverMenuItem;
