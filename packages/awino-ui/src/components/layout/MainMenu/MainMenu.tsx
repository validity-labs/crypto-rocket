import * as React from 'react';

import { useTranslation } from 'next-i18next';

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { mainMenuLinks } from '@/app/menu';
import Link from '@/components/general/Link/Link';
import { MenuItemGroup, MenuItemLink, MenuItemType } from '@/types/app';

import Menu from '../Menu/Menu';

const Root = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: +theme.shape.borderRadius * 2,
  background: theme.palette.background.transparent,
  padding: theme.spacing(0, 2),
  '.MenuItem-content': {
    display: 'block',
    padding: theme.spacing(5, 4),
    whiteSpace: 'nowrap',
    color: theme.palette.text.primary,
    transition: 'color 200ms ease-in',
    '&:hover, &.active': {
      transition: 'color 200ms ease-in',
      color: theme.palette.text.active,
    },
  },
}));

interface MenuItemProps {
  item: MenuItemType;
  i18nKey: string;
}

function MenuItem({ item, i18nKey }: MenuItemProps) {
  const { t } = useTranslation();
  const { type, key } = item;

  if (type === 'internal' || type === 'external') {
    const { url } = item as MenuItemLink;
    return (
      <li>
        <Typography variant="menu" component={Link} href={url} className="MenuItem-content">
          {t(`menu.${i18nKey}.${key}.title`)}
        </Typography>
      </li>
    );
  }

  if (type === 'group') {
    return (
      <li>
        <Menu parentKey={key} i18nKey={i18nKey} items={(item as MenuItemGroup).items} />
      </li>
    );
  }

  return null;
}

export default function MainMenu() {
  return (
    <Root>
      {mainMenuLinks.map((link) => (
        <MenuItem key={link.key} item={link} i18nKey="main" />
      ))}
    </Root>
  );
}
