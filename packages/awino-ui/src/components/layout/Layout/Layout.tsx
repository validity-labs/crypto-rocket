import type { ReactElement, ReactNode } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { CircularProgress, Typography } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import ConnectPanel from '@/components/general/ConnectPanel/ConnectPanel';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Section from '../Section/Section';
import Snackbar from '../Snackbar/Snackbar';

const WalletConnect = dynamic(() => import('@/components/modals/WalletConnect/WalletConnect'));

interface Props {
  children: ReactNode;
  initialized: boolean;
  authorized: boolean;
}

export default function Layout(props: Props): ReactElement {
  const { t } = useTranslation();
  const { children, initialized, authorized } = props;
  const openConnector = useAppSelector((state) => state.app.connector);

  return (
    <>
      <Typography component="a" className="aria" href="#main">
        {t('common.skip-to-main')}
      </Typography>
      <Header />
      {/* tabIndex={-1} creates outline on safari, temporarily removed */}
      <main id="main" /* tabIndex={-1} */>
        {initialized ? (
          <>
            {
              // show page content when application is initialized and authorization is granted
              authorized ? (
                children
              ) : (
                // show connect panel when application is initialized but authorization is not granted
                <Section>
                  <ConnectPanel />
                </Section>
              )
            }
          </>
        ) : (
          // show loading animation until application is initialized
          <Section containerProps={{ sx: { textAlign: 'center' } }}>
            <CircularProgress />
          </Section>
        )}
      </main>
      <Footer />
      <Snackbar />
      {openConnector && <WalletConnect />}
    </>
  );
}
