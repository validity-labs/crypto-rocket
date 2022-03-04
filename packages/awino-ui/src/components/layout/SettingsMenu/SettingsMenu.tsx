import * as React from 'react';

import { useTranslation } from 'next-i18next';

import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton, Menu, MenuItem, MenuProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { settingMenuLinks } from '@/app/menu';
import Link from '@/components/general/Link/Link';

import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';

const ToggleButton = styled(IconButton)(({ theme }) => ({
  transition: 'color 300ms ease-in-out',
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
  '& .MuiPaper-root': {
    marginTop: theme.spacing(8),
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
        <SettingsIcon />
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
        <MenuItem divider>
          <LanguageSwitch onClose={handleClose} />
        </MenuItem>
        {settingMenuLinks.map(({ key, url }, index) => (
          <MenuItem key={key} onClick={handleClose} divider={index !== settingMenuLinks.length - 1}>
            <Typography component={Link} href={url} variant="menu" className="MuiMenuItem-content">
              {t(`menu.settings.${key}.title`)}
            </Typography>
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
}
