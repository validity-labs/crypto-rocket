import { useMemo } from 'react';
import * as React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import clsx from 'clsx';

import { MenuItem, ButtonBase, Menu as MuiMenu, MenuProps, Typography } from '@mui/material';
import {} from '@mui/material';
import { styled } from '@mui/material/styles';

import Link from '@/components/general/Link/Link';

const ToggleButton = styled(ButtonBase)(({ theme }) => ({
  ...theme.typography.menu,
  transition: 'color 300ms ease-in-out',
  '&:hover, &[aria-expanded="true"]': {
    color: theme.palette.text.active,
    background: 'initial',
  },
  '&.Mui-focusVisible': {
    outlineOffset: -2,
    outlineWidth: 1,
    outlineColor: theme.palette.text.active,
    outlineStyle: 'auto',
  },
  '& .active': {
    color: theme.palette.text.active,
    transition: 'color 300ms ease-in-out',
  },
}));

const StyledMenu = styled((props: MenuProps) => (
  <MuiMenu
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
))(({ theme }) => ({
  // '.MuiMenu-list': {
  // padding: theme.spacing(1.5, 0, 2.5),
  // },
  '.MuiMenuItem-content': {
    padding: theme.spacing(4, 8),
    ...theme.typography.menu,
  },
}));
interface Props {
  parentKey: string;
  i18nKey: string;
  items: {
    key: string;
    url: string;
  }[];
}
export default function Menu({ parentKey, i18nKey, items }: Props) {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  const isActive = useMemo(() => {
    return !!items.find((f) => f.url === pathname);
  }, [pathname, items]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ToggleButton
        id={`${parentKey}SwitchButton`}
        className="MenuItem-content"
        aria-controls={`${parentKey}SwitchMenu`}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disableRipple
        // tabIndex={-1}
      >
        <Typography variant="menu" className={clsx({ active: open || isActive })}>
          {t(`menu.${i18nKey}.${parentKey}.title`)}
        </Typography>
      </ToggleButton>
      <StyledMenu
        id={`${parentKey}SwitchMenu`}
        MenuListProps={{
          'aria-labelledby': `${parentKey}SwitchButton`,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {items.map(({ key, url }, index) => (
          <MenuItem key={key} onClick={handleClose} divider={index !== items.length - 1} dense>
            <Typography component={Link} href={url} className="MuiMenuItem-content">
              {t(`menu.${i18nKey}.${parentKey}.${key}`)}
            </Typography>
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
}
