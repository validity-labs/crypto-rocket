import { useMemo } from 'react';
import * as React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import clsx from 'clsx';

import { MenuItem, ButtonBase, Typography, Popper, Paper, Grow, ClickAwayListener, MenuList } from '@mui/material';
import {} from '@mui/material';
import { styled } from '@mui/material/styles';

import Link from '@/components/general/Link/Link';

import HoverMenu from './HoverMenu';

const Root = styled(HoverMenu)(({ theme }) => ({
  '.AwiHoverMenu-toggle': {
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
  },
  '.AwiHoverMenu-paper': {
    marginTop: `${theme.spacing(2)} !important`,
  },
  '.MuiList-root': {
    backgroundColor: theme.palette.background.light,
    padding: 0,
    overflow: 'hidden',
  },
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
  return (
    <Root
      id={`${parentKey}Menu`}
      toggle={
        <Typography variant="menu" className={clsx({ active: isActive })}>
          {t(`menu.${i18nKey}.${parentKey}.title`)}
        </Typography>
      }
      toggleComponent={ButtonBase}
    >
      {({ close }) =>
        items.map(({ key, url }, index) => (
          <MenuItem key={key} component={Link} href={url} onClick={close} divider={index !== items.length - 1} dense>
            <Typography className="MuiMenuItem-content">{t(`menu.${i18nKey}.${parentKey}.${key}`)}</Typography>
          </MenuItem>
        ))
      }
    </Root>
  );
}
