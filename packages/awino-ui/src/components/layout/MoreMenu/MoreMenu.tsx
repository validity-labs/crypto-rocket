import * as React from 'react';

import { useTranslation } from 'next-i18next';

import { IconButton, Menu, MenuItem, MenuProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { moreMenuLinks, socialLinks } from '@/app/menu';
import Link from '@/components/general/Link/Link';
import MoreIcon from '@/components/icons/MoreIcon';

const ToggleButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 4, 0, 31),
  padding: theme.spacing(2),
  border: '2px solid #00FFEB',
  borderRadius: +theme.shape.borderRadius * 2,
  transition: 'color 300ms ease-in-out',
  '& svg': {
    fontSize: '30px',
  },
  '&[aria-expanded="true"]': {
    color: theme.palette.text.active,
    transition: 'color 300ms ease-in-out',
  },
}));

const StyledMenu = styled((props: MenuProps) => (
  <Menu
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
  '.MuiPaper-root': {
    marginTop: theme.spacing(8),
  },
  '.MuiMenu-list': {
    padding: theme.spacing(1.5, 0, 2.5),
  },
  '.MuiMenuItem-spacer': {
    height: theme.spacing(1),
  },
  '.MuiMenuItem-content': {
    ...theme.typography['body-xs'],
    fontWeight: 600,
  },
  '.title-description': {
    textAlign: 'center',
    span: {
      display: 'block',
      marginTop: theme.spacing(1),
      ...theme.typography.menu,
      fontWeight: 500,
    },
    '&:hover': {
      span: {
        color: 'inherit',
      },
    },
  },
  '.icon-title': {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography['body-xs'],
    fontWeight: 600,
    color: theme.palette.text.menu,
    img: {
      marginRight: theme.spacing(3),
    },
  },
}));

export default function SettingsMenu() {
  const { t } = useTranslation();

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
        id="settingsMenuToggle"
        size="small"
        aria-label={t(`menu.settings.toggle-label`)}
        aria-controls="settingsMenu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreIcon />
      </ToggleButton>
      <StyledMenu
        id="settingsMenu"
        MenuListProps={{
          'aria-labelledby': 'settingsMenuToggle',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {moreMenuLinks.map(({ key, url }, index) => (
          <MenuItem key={key} onClick={handleClose} divider={index !== moreMenuLinks.length - 1}>
            <Typography component={Link} href={url} className="MuiMenuItem-content title-description">
              {t(`menu.more.${key}.title`)}
              <Typography component="span">{t(`menu.more.${key}.description`)}</Typography>
            </Typography>
          </MenuItem>
        ))}
        <li role="presentation" className="MuiMenuItem-spacer" />
        {socialLinks.map(({ key, url }) => (
          <MenuItem key={key} onClick={handleClose} divider={false} dense>
            <Typography component={Link} href={url} className="MuiMenuItem-content icon-title">
              <img src={`/images/icons/${key}.svg`} alt="" width="22" height="22" />
              {t(`menu.social.${key}.title`)}
            </Typography>
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
}
