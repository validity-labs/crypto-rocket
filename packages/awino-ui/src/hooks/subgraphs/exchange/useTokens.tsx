import useSWR from 'swr';

import { ExchangeTokensResponse, EXCHANGE_TOKENS_QUERY } from '@/lib/graphql/api/exchange';
import { createFetcher } from '@/lib/graphql/helpers';

const SUBGRAPH_EXCHANGE_KEY = 'exchange';
const fetcher = createFetcher(SUBGRAPH_EXCHANGE_KEY);

export const useTokens = () => {
  return useSWR<ExchangeTokensResponse>([EXCHANGE_TOKENS_QUERY], fetcher, {
    refreshInterval: 0,
  });
};
