// import '../styles/globals.css';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { CacheProvider, EmotionCache } from '@emotion/react';

import createEmotionCache from '@/app/createEmotionCache';
// import { useAppDispatch } from '@/app/hooks';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import storeWrapper from '@/app/store';
import Layout from '@/components/layout/Layout/Layout';
import { I18nPageNamespace } from '@/types/app';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pageProps: {
    ns: I18nPageNamespace;
    [key: string]: any;
  };
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  // const { account, chainId } = useEthers();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Awino</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider>
        <Layout>
          {/* @ts-ignore */}
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default storeWrapper.withRedux(appWithTranslation(MyApp));
