import React, { useCallback } from 'react';

import { useTranslation } from 'next-i18next';

import CloseIcon from '@mui/icons-material/CloseRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider, IconButton, List, ListItem, ListItemButton, SwipeableDrawer, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SUPPORTED_LANGUAGES } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { mainMenuLinks, moreMenuLinks, settingMenuLinks, socialLinks } from '@/app/menu';
import { toggleDrawer } from '@/app/state/slices/app';
import ConnectButton from '@/components/buttons/ConnectButton';
import Link from '@/components/general/Link/Link';
import MoreIcon from '@/components/icons/MoreIcon';
import { Language, MenuItemGroup, MenuItemLink, MenuItemType } from '@/types/app';

import Logo from '../Logo/Logo';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

import IconDivider from './IconDivider';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '.MuiPaper-root': {
    display: 'flex',
    width: '90%',
    backgroundColor: theme.palette.background.main,
    overflow: 'hidden',
  },
  '.MuiListItem-root': {
    color: theme.palette.text.secondary,
  },
  '.MuiListItemButton-root.link': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    img: {
      // fontSize: '18px',
      marginRight: theme.spacing(3),
    },
  },
  '.AwiDrawer-content': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(8, 4, 0),
    overflow: 'auto',
  },
  '.AwiDrawer-footer': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 6),
    color: theme.palette.text.primary,
  },
  '.AwiDrawer-footerRight': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

interface LinkListProps {
  items: MenuItemType[];
  menu: string;
  // eslint-disable-next-line no-unused-vars
  closeDrawer: (event: React.KeyboardEvent | React.MouseEvent) => void;
  icon?: boolean;
}

const LinkList = ({ items, menu, closeDrawer, icon = false }: LinkListProps) => {
  const { t } = useTranslation();
  return (
    <List>
      {items.map(({ type, key, ...link }) => {
        const isURL = type === 'internal' || type === 'external';
        const Icon = (link as MenuItemLink)?.icon;
        return (
          <React.Fragment key={key}>
            <ListItemButton
              disabled={!isURL}
              {...(isURL ? { component: Link, href: (link as MenuItemLink).url, className: 'link' } : {})}
              onClick={isURL ? closeDrawer : () => {}}
            >
              {/* {icon && <Icon />} */}
              {icon && <img src={`/images/icons/${key}.svg`} alt="" width="22" height="22" />}
              <Typography variant="menu" component="span">
                {t(`menu.${menu}.${key}.title`)}
              </Typography>
            </ListItemButton>
            {type === 'group' && (
              <List sx={{ ml: 6 }}>
                {(link as MenuItemGroup).items.map(({ key: itemKey, url: itemUrl }) => (
                  <ListItemButton key={itemKey} component={Link} href={itemUrl} onClick={closeDrawer}>
                    <Typography variant="menu" component="span" className="link">
                      {t(`menu.${menu}.${key}.${itemKey}`)}
                    </Typography>
                  </ListItemButton>
                ))}
              </List>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default function Drawer() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.app.drawer);

  const handleDrawerClose = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      dispatch(toggleDrawer(false));
    },
    [dispatch]
  );

  const handleDrawerOpen = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      dispatch(toggleDrawer(true));
    },
    [dispatch]
  );

  const changeLanguage = (language: Language /* router: NextRouter, lang: string */) => {
    i18n.changeLanguage(language);
    dispatch(toggleDrawer(false));
  };

  return (
    <StyledSwipeableDrawer anchor="left" open={open} onClose={handleDrawerClose} onOpen={handleDrawerOpen}>
      <div className="AwiDrawer-content">
        <Logo />
        <LinkList items={mainMenuLinks} menu="main" closeDrawer={handleDrawerClose} />
        <IconDivider icon={SettingsIcon} />
        <List>
          <ListItem button={false}>
            <Typography variant="menu" color="text.secondary">
              {t('language.choose')}
            </Typography>
          </ListItem>
          <List sx={{ ml: 6 }}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <ListItemButton
                key={lang}
                selected={lang === i18n.language}
                className="link"
                onClick={() => {
                  changeLanguage(lang);
                }}
              >
                <Typography variant="menu" component="span">
                  {t(`language.${lang}`)}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </List>
        <LinkList items={settingMenuLinks as MenuItemType[]} menu="settings" closeDrawer={handleDrawerClose} />
        <IconDivider icon={MoreIcon} />
        <LinkList items={moreMenuLinks as MenuItemType[]} menu="more" closeDrawer={handleDrawerClose} />
        <LinkList items={socialLinks as MenuItemType[]} menu="social" closeDrawer={handleDrawerClose} icon />
      </div>
      <Divider />
      <div className="AwiDrawer-footer">
        <ConnectButton size="small" />
        <div className="AwiDrawer-footerRight">
          <ThemeSwitch />
          <IconButton color="inherit" aria-label={t('header.close-menu')} onClick={handleDrawerClose}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    </StyledSwipeableDrawer>
  );
}
