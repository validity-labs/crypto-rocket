// import '../styles/globals.css';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Provider } from 'react-redux';

import { CacheProvider, EmotionCache } from '@emotion/react';

import createEmotionCache from '@/app/createEmotionCache';
// import { useAppDispatch } from '@/app/hooks';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import store from '@/app/store';
import Layout from '@/components/layout/Layout/Layout';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  // const { account, chainId } = useEthers();
  // const dispatch = useAppDispatch();
  // useEffect(() => {
  //   // Local account array updated
  //   dispatch(setActiveAccount(account));
  // }, [account, dispatch]);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Awino</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}

export default appWithTranslation(MyApp);
