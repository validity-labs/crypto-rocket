import React, { ReactElement } from 'react';

import { useTranslation } from 'next-i18next';

import ScrollToTop from 'react-scroll-up';

import ArrowUpIcon from '@mui/icons-material/ExpandLessRounded';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('div')({
  position: 'static',
  '.button': {
    svg: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: ['rgb(0,255,235)', 'linear-gradient(180deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 50%)'],
      fontSize: '30px',
      color: '#002e42',
    },
  },
});

const scrollToTopStyles = { position: 'relative', right: 'auto', bottom: 'auto' };

export default function ScrollUp(props): ReactElement {
  const { t } = useTranslation();

  return (
    <Root {...props}>
      <ScrollToTop showUnder={10} style={scrollToTopStyles}>
        <IconButton className="button" title={t('footer.scroll-to-top')}>
          <ArrowUpIcon />
        </IconButton>
      </ScrollToTop>
    </Root>
  );
}
