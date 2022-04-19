import * as React from 'react';

import { useTranslation } from 'next-i18next';

import clsx from 'clsx';

import { styled } from '@mui/material/styles';

import { moreMenuLinks, socialLinks } from '@/app/menu';
import Link from '@/components/general/Link/Link';
import MoreIcon from '@/components/icons/MoreIcon';

import HoverMenu from '../Menu/HoverMenu';
import HoverMenuItem from '../Menu/HoverMenuItem';

const Root = styled(HoverMenu)(({ theme }) => ({
  '.AwiHoverMenu-toggle': {
    margin: theme.spacing(0, 4, 0, 31),
    padding: theme.spacing(2),
    border: '2px solid #00FFEB',
    borderRadius: +theme.shape.borderRadius * 2,
    '& svg': {
      fontSize: '30px',
    },
  },
  '.AwiMoreMenu-title': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...theme.typography['body-xs'],
    fontWeight: 600,
    span: {
      marginTop: theme.spacing(1),
      ...theme.typography.menu,
      fontWeight: 500,
    },
  },
  '.AwiMoreMenu-social': {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography['body-xs'],
    fontWeight: 600,
    img: {
      marginRight: theme.spacing(2),
    },
  },
  '.AwiMoreMenu-spacer': {
    marginTop: theme.spacing(2),
  },
  '.AwiHoverMenu-list': {
    paddingBottom: theme.spacing(6),
  },
}));

export default function MoreMenu() {
  const { t } = useTranslation();

  return (
    <Root id="moreMenu" ariaLabel={t(`menu.more.toggle-label`)} toggle={<MoreIcon />}>
      {({ close }) => [
        ...moreMenuLinks.map(({ key, url }, index) => (
          <HoverMenuItem key={key} close={close} className={clsx({ 'Awi-reset': index === moreMenuLinks.length - 1 })}>
            <Link href={url} className="AwiMoreMenu-title">
              {t(`menu.more.${key}.title`)}
              <span>{t(`menu.more.${key}.description`)}</span>
            </Link>
          </HoverMenuItem>
        )),
        <li key="spacer" role="presentation">
          <div className="AwiMoreMenu-spacer"></div>
        </li>,
        ...socialLinks.map(({ key, url }) => (
          <HoverMenuItem key={key} close={close} className="Awi-reset Awi-dense">
            <Link href={url} className="AwiMoreMenu-social">
              <img src={`/images/icons/${key}.svg`} alt="" width="22" height="22" />
              {t(`menu.social.${key}.title`)}
            </Link>
          </HoverMenuItem>
        )),
      ]}
    </Root>
  );
}
