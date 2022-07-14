// import '../styles/globals.css';

import { useEffect, useMemo, useState } from 'react';

import { appWithTranslation, useTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { createSelector } from '@reduxjs/toolkit';

import { CacheProvider, EmotionCache } from '@emotion/react';

import { PROTECTED_ROUTES } from '@/app/constants';
import createEmotionCache from '@/app/createEmotionCache';
// import { useAppDispatch } from '@/app/hooks';
import { changeDateIOLocale } from '@/app/dateIO';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import Web3Provider from '@/app/providers/Web3Provider';
import { toggleConnector } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Layout from '@/components/layout/Layout/Layout';
import { ExampleAPIFetchResponse, EXAMPLE_API_QUERY } from '@/lib/graphql/api/farm';
import { I18nPageNamespace, Language } from '@/types/app';

// import { UserRejectedRequestError as UserRejec
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pageProps: {
    ns: I18nPageNamespace;
    [key: string]: any;
  };
}

const appStateSelector = createSelector(
  [(state) => state.app.initializing, (state) => state.account.connected],
  (isAppInitilized, isAccountConnected) => [!isAppInitilized, isAccountConnected]
);

function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    router: { locale },
  } = props;
  // const { account, chainId } = useEthers();
  // eslint-disable-next-line no-unused-vars
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isAppInitialized, isAccountConnected] = useAppSelector(appStateSelector); /* useAppSelector((state) => {
    console.log('app selector changed');
    return [!state.app.initializing, state.account.connected];
  }); */

  // rerender tree so on language change date-io locale is applied properly
  const [, setDateLocale] = useState<Language | undefined>();

  const isPageProtected = useMemo(() => pageProps.protected || false, [pageProps]);

  /*
    when application initialization is complete trigger showing connect modal if user is
    a guest and page is protected
  */
  useEffect(() => {
    if (isAppInitialized) {
      const canProceed = isAccountConnected || !isPageProtected;
      if (!canProceed) {
        dispatch(toggleConnector(true));
      }
    }
  }, [isAppInitialized, isAccountConnected, dispatch, isPageProtected]);

  /*
    intercept page navigation (internal link click) to trigger showing connect
    modal if user is a guest and page is protected
  */
  useEffect(() => {
    const handleRouteComplete = (url: string) => {
      if (!isAccountConnected && PROTECTED_ROUTES.filter((protectedRoute) => url.startsWith(protectedRoute)).length) {
        dispatch(toggleConnector(true));

        // router.events.emit('routeChangeError');
        // throw 'routeChange aborted.';
      }
    };

    router.events.on('routeChangeComplete', handleRouteComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
  }, [isAccountConnected, router, dispatch]);

  useEffect(() => {
    // on language change, change date-io locale with dynamic load
    changeDateIOLocale(locale as Language).then(() => {
      setDateLocale(locale as Language);
    });
  }, [locale]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>AWINO</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Web3Provider>
        <ThemeProvider>
          <Layout initialized={isAppInitialized} authorized={isAccountConnected || !isPageProtected}>
            {/* @ts-ignore */}
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </Web3Provider>
    </CacheProvider>
  );
}

export default storeWrapper.withRedux(appWithTranslation(MyApp));
