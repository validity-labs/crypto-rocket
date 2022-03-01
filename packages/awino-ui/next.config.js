const { i18n } = require('./next-i18next.config');
// const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = async (phase, { defaultConfig }) => {
  /**
    * @type {import('./src/types').NextAppConfig}
   */
  let nextConfig = {
    i18n,
    /* config options here */
  }

  return nextConfig;
  // if (phase === PHASE_DEVELOPMENT_SERVER) {
}


