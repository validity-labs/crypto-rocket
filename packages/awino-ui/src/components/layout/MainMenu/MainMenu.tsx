import * as React from 'react';

import { useTranslation } from 'next-i18next';

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
  zIndex: theme.zIndex.appBar,
  '.AwiMainMenu-item, .AwiHoverMenu-toggle': {
    display: 'block',
    padding: theme.spacing(5, 4),
    whiteSpace: 'nowrap',
    ...theme.typography.menu,
    color: theme.palette.text.primary,
    transition: 'color 200ms ease-in',
    '&:hover, &.Awi-active, &[aria-expanded="true"]': {
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
        <Link href={url} className="AwiMainMenu-item">
          {t(`menu.${i18nKey}.${key}.title`)}
        </Link>
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
