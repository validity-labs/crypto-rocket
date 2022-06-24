import * as React from 'react';

import Document, { Html, Head, Main, NextScript } from 'next/document';

import createEmotionServer from '@emotion/server/create-instance';

import createEmotionCache from '@/app/createEmotionCache';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang={this.props.__NEXT_DATA__.locale || 'en'}>
        <Head>
          {/* PWA primary color */}
          {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#10172b" />
          <meta name="theme-color" content="#10172b" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          {/* eslint-disable-next-line @next/next/google-font-display  */}
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&family=Comfortaa:wght@400;600;700&display=block"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&family=Baloo+Bhai+2&display=swap"
            rel="stylesheet"
          />
          <script
            src="https://polyfill.io/v3/polyfill.min.js?features=Intl.NumberFormat,Intl.NumberFormat.~locale.en,Intl.NumberFormat.~locale.de"
            defer
          ></script>
          {/* Inject MUI styles first to match with the prepend: true configuration. */}
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
