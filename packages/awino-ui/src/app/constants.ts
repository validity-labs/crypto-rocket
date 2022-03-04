// import getConfig from './env';
// import { Language } from '@/typings/app';

import type { Language } from '@/types/app';

// const {
//   serverRuntimeConfig,
//   publicRuntimeConfig: { baseDomain, cmsEndpoint, googleRecaptchaSiteKey, subscribeEndpoint },
// } = getConfig();

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'de'];

export const isBrowser = typeof window !== 'undefined';
// export const ITEMS_PER_PAGE = 2;

// export const TABLE_ROWS_PER_PAGE = 2;
// export const TABLE_ROWS_PER_PAGE_OPTIONS = [2, 10, 25, 50];

// export const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

// export const DEFAULT_DATE_PRETTY_FORMAT = 'MMMM d, yyyy';

// export const DEFAULT_DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm';

// export const BASE_DOMAIN = baseDomain;

// export const CMS_ENDPOINT = serverRuntimeConfig?.cmsEndpoint || cmsEndpoint;

// export const GOOGLE_RECAPTCHA_SITE_KEY = googleRecaptchaSiteKey;

// export const SUBSCRIBE_ENDPOINT = subscribeEndpoint;

// TODO WIP Read from env variable
export const CHAIN_ID = +'4';
