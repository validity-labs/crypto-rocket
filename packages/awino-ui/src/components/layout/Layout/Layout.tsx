import type { ReactElement, ReactNode } from 'react';

import { useTranslation } from 'next-i18next';

import { Typography } from '@mui/material';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Snackbar from '../Snackbar/Snackbar';

interface Props {
  children: ReactNode;
}

export default function Layout(props: Props): ReactElement {
  const { t } = useTranslation();
  const { children } = props;

  return (
    <>
      <Typography component="a" className="aria" href="#main">
        {t('common.skip-to-main')}
      </Typography>
      <Header />
      {/* tabIndex={-1} creates outline on safari, temporarily removed */}
      <main id="main" /* tabIndex={-1} */>{children}</main>
      <Footer />
      <Snackbar />
    </>
  );
}
