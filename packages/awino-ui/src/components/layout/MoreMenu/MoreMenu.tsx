import * as React from 'react';

import { useTranslation } from 'next-i18next';

import { ButtonBase, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { moreMenuLinks, socialLinks } from '@/app/menu';
import Link from '@/components/general/Link/Link';
import MoreIcon from '@/components/icons/MoreIcon';

import HoverMenu from '../Menu/HoverMenu';

const Root = styled(HoverMenu)(({ theme }) => ({
  '.AwiHoverMenu-toggle': {
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
  },
  '.MuiMenuItem-content': {
    ...theme.typography['body-xs'],
    fontWeight: 600,
  },
  '.MuiMenu-list': {
    padding: theme.spacing(1.5, 0, 2.5),
  },
  '.MuiMenuItem-spacer': {
    height: theme.spacing(1),
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

export default function MoreMenu() {
  const { t } = useTranslation();

  return (
    <Root id="moreMenu" ariaLabel={t(`menu.more.toggle-label`)} toggle={<MoreIcon />}>
      {({ close }) => [
        ...moreMenuLinks.map(({ key, url }, index) => (
          <MenuItem key={key} component={Link} href={url} onClick={close} divider={index !== moreMenuLinks.length - 1}>
            <Typography className="MuiMenuItem-content title-description">
              {t(`menu.more.${key}.title`)}
              <Typography component="span">{t(`menu.more.${key}.description`)}</Typography>
            </Typography>
          </MenuItem>
        )),
        <div key="spacer" role="presentation" className="MuiMenuItem-spacer" />,
        ...socialLinks.map(({ key, url }) => (
          <MenuItem key={key} component={Link} href={url} onClick={close} divider={false} dense>
            <Typography className="MuiMenuItem-content icon-title">
              <img src={`/images/icons/${key}.svg`} alt="" width="22" height="22" />
              {t(`menu.social.${key}.title`)}
            </Typography>
          </MenuItem>
        )),
      ]}
    </Root>
  );
}
