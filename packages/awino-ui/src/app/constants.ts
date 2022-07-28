import type { Language } from '@/types/app';

import getConfig from './env';

const {
  // serverRuntimeConfig,
  publicRuntimeConfig: {
    chainId,
    baseDomain,
    etherscanApiKey,
    blockchainExplorerUrl,
    blockchainTransactionExplorerUrl,
    dataMiner,
  },
} = getConfig();

export const SUPPORTED_LANGUAGES: Language[] = ['en' /*  'de' */];

export const isBrowser = typeof window !== 'undefined';
// export const ITEMS_PER_PAGE = 2;

export const TABLE_ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
export const TABLE_ROWS_PER_PAGE = TABLE_ROWS_PER_PAGE_OPTIONS[0];

export const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
export const SHORT_DATE_FORMAT = 'MMM d, yy';

export const DEFAULT_DATE_PRETTY_FORMAT = 'MMMM d, yyyy';

export const DEFAULT_DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm';

export const DEFAULT_DATE_TIME_PRETTY_FORMAT = 'MMMM d, yyyy HH:mm';

export const BASE_DOMAIN = baseDomain;

// export const CMS_ENDPOINT = serverRuntimeConfig?.cmsEndpoint || cmsEndpoint;

// export const GOOGLE_RECAPTCHA_SITE_KEY = googleRecaptchaSiteKey;

// export const SUBSCRIBE_ENDPOINT = subscribeEndpoint;

export const ETHERSCAN_API_KEY = etherscanApiKey ?? '';

// TODO WIP Read from env variable
export const CHAIN_ID = chainId;

export const PROTECTED_ROUTES = ['/portfolio', '/swap'];

export const CHART_COLORS = ['#00EC62', '#9A6400', '#00F6B1', '#F5AC37', '#26A17B', '#C49949', '#2775CA', '#694603'];

export const SYMBOLS = {
  AWINO: 'AWINO',
  USD: 'USD',
};

export const enum ProposalState {
  UNDETERMINED = -1,
  PENDING,
  ACTIVE,
  CANCELED,
  DEFEATED,
  SUCCEEDED,
  QUEUED,
  EXPIRED,
  EXECUTED,
  VETOED,
}

export const AVERAGE_BLOCK_TIME_IN_SECS = 13;

export const TEXT_PLACEHOLDER_HALF = 'The quick brown fox';
export const TEXT_PLACEHOLDER = 'The quick brown fox jumps over the lazy dog';

export const PAGINATION_PAGE_SIZE = 2;

export const ECR20_TOKEN_DECIMALS = 18;

export const BLOCKCHAIN_EXPLORER_URL = blockchainExplorerUrl;

export const BLOCKCHAIN_TRANSACTION_EXPLORER_URL = blockchainTransactionExplorerUrl;

export const BLOCKS_PER_YEAR = 2104400;

export const DATA_MINER = {
  URL: dataMiner.url,
  KEY: dataMiner.key,
};
