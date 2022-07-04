import React, { ReactElement } from 'react';

import { useTranslation } from 'next-i18next';

import { Container, Divider, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppSelector } from '@/app/hooks';
import { footerLinks, socialLinks } from '@/app/menu';
import Link from '@/components/general/Link/Link';
import ScrollUp from '@/components/layout/ScrollUp/ScrollUp';
import { formatAmount } from '@/lib/formatters';

const Root = styled('footer')(({ theme }) => ({
  margin: theme.spacing(10, 0, 0),
  padding: theme.spacing(5, 0),
  color: theme.palette.text.menu,
  '.MuiTypography-root': {
    fontSize: '0.8125rem' /* 13px */,
  },
  '.top': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 0, 6),
  },
  '.bottom': {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(5, 0, 0),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  '.list': {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    li: {
      margin: theme.spacing(0, 3),
    },
  },
  '.social': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '.icon': {
      svg: {
        fontSize: '22px',
      },
    },
    '.up': {
      marginLeft: theme.spacing(3),
    },
  },
  '.rate': {
    display: 'flex',
    alignItems: 'center',
    img: {
      position: 'relative',
      top: -2,
      display: 'block',
      width: 24,
      height: 24,
      margin: theme.spacing(0, 3),
      lineHeight: 0,
    },
  },
  '.copyright, .list, .social': {
    margin: theme.spacing(0, 0, 5),
  },
  '.divider': {
    borderColor: '#3b414e',
  },
}));

export default function Footer(): ReactElement {
  const { t } = useTranslation();
  const awiRate = useAppSelector((state) => state.app.awi);
  const copyright = t('footer.copyright', { year: new Date().getFullYear() });
  return (
    <Root>
      <Container>
        <div className="top">
          <Typography variant="menu" color="inherit" className="rate">
            {t('common.awi')}
            <img src="/images/assets/awi.svg" alt="" />
            {formatAmount(awiRate, { prefix: 'USD' })}
          </Typography>
        </div>
        <Divider className="divider" />
        <div className="bottom">
          <Typography variant="menu" color="inherit" className="copyright">
            {copyright}
          </Typography>
          <ul className="list">
            {footerLinks.general.map(({ key, url }) => (
              <li key={key}>
                <Typography component={Link} href={url} download target="_blank" variant="menu" color="inherit">
                  {t(`footer.common.${key}`)}
                </Typography>
              </li>
            ))}
          </ul>
          <div className="social">
            {socialLinks.map(({ key, url }) => (
              <IconButton key={key} className="icon" component={Link} href={url} title={t(`menu.social.${key}.title`)}>
                <img src={`/images/icons/${key}.svg`} alt="" width="22" height="22" />
              </IconButton>
            ))}
            <ScrollUp className="up" />
          </div>
        </div>
      </Container>
    </Root>
  );
}
