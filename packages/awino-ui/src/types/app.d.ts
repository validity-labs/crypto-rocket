import { NextConfig } from 'next';

export interface NextAppConfig extends NextConfig {
  serverRuntimeConfig?: {
    cmsEndpoint: string;
  };
  publicRuntimeConfig: {
    baseDomain: string;
    cmsEndpoint: string;
    googleRecaptchaSiteKey: string;
    subscribeEndpoint: string;
  };
}
