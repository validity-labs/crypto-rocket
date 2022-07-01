const { i18n } = require('./next-i18next.config');
// const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = async (/* phase, { defaultConfig } */) => {
  /**
   * @type {import('./src/types').NextAppConfig}
   */
  let nextConfig = {
    i18n,
    reactStrictMode: true,
    // images: {
    //   domains: ['storage.googleapis.com'],
    //   deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    //   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
    // },
    serverRuntimeConfig: {},
    publicRuntimeConfig: {
      baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN,
      etherscanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
      chainId: process.env.NEXT_CHAIN_ID,
    },
    async rewrites() {
      console.log('rewriates called');
      return [
        {
          source: '/api/subgraph/:path*',
          destination: `${process.env.NEXT_PRIVATE_SUBGRAPH_URL}/:path*`
        },
      ]
    }


  };

  return nextConfig;
  // if (phase === PHASE_DEVELOPMENT_SERVER) {
};
