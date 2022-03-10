import getNextConfig from 'next/config';

import { NextAppConfig } from '@/types/app';

const getConfig = (): NextAppConfig => {
  const { serverRuntimeConfig = {}, publicRuntimeConfig = {} } = getNextConfig() || {};
  return { serverRuntimeConfig, publicRuntimeConfig };
};

export default getConfig;
