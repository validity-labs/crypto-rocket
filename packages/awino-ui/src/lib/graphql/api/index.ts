import { SubgraphKey, SubgraphFetcher } from '../helpers';

import * as exchange from './exchange';
import * as masterchef from './masterchef';

const fetchers: Record<SubgraphKey, SubgraphFetcher> = {
  exchange: exchange.fetcher,
  masterchef: masterchef.fetcher,
};

const prepareKeyToMetaMap = ({ default: keyToQueryMap, fetcherKey }) => {
  return Object.keys(keyToQueryMap).reduce((ar, r) => {
    ar[r] = [fetcherKey, keyToQueryMap[r]];
    return ar;
  }, {});
};

// type FetchResponseType = exchange.QueryResponseType | masterchef.QueryResponseType;

type FetchKey = keyof typeof exchange.default | keyof typeof masterchef.default;

/* @ts-ignore */
const keyToMetaMap: Record<FetchKey, [SubgraphKey, string]> = {
  ...prepareKeyToMetaMap(exchange),
  ...prepareKeyToMetaMap(masterchef),
};

const fetchQuery = <T>(key: FetchKey, variables) => {
  // console.log('fetchQuery', key, variables, keyToMetaMap[key]);
  const [fetcherKey, query] = keyToMetaMap[key];
  const fetcher = fetchers[fetcherKey];
  return fetcher(query, variables) as Promise<T>;
};

export default fetchQuery;
