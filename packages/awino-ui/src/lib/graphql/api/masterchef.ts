import { gql } from 'graphql-request';

import { Address } from '@/types/app';

import { createFetcher, GraphqlResponse } from '../helpers';

export const fetcherKey = 'masterchef';
export const fetcher = createFetcher(fetcherKey);

const MASTERCHEF_MASTERCHEFS_QUERY = gql`
  query {
    items: masterChefs {
      address: id
      totalRegularAllocPoint
      cakeRateToRegularFarm
    }
  }
`;

export type MasterchefMasterchefRaw = {
  address: Address;
  totalRegularAllocPoint: string;
  cakeRateToRegularFarm: string;
};
export type MasterchefMasterchefsResponse = {
  items: MasterchefMasterchefRaw[];
};

// TODO: staked balance should be a value of rewardDebt, but amount is used to have temporary value as suggested by @kpaschalidis
const MASTERCHEF_PAGINATED_USER_POOL_PAIRS_QUERY = gql`
  query ($account: Bytes, $first: Int, $skip: Int) {
    items: users(
      where: { address: $account }
      first: $first
      skip: $skip
      orderBy: "timestamp"
      orderDirection: "desc"
    ) {
      id
      boostMultiplier
      reward: rewardDebt
      staked: amount
      pool {
        id
        pair
        isRegular
        allocPoint
      }
    }
  }
`;
export interface MasterchefUserPoolRaw {
  id: Address;
  pool: {
    id: string;
    pair: Address;
    isRegular: boolean;
    allocPoint: string;
  };
  staked: string;
}

type MasterchefUserPoolsResponse = {
  items: MasterchefUserPoolRaw[];
};

// query ($ids: [ID!], $first: Int, $skip: Int) {
//   items: pairs(where: { id_not_in: $ids }, first: $first, skip: $skip, orderBy: "timestamp", orderDirection: "desc") {
const MASTERCHEF_PAGINATED_POOL_PAIRS_QUERY = gql`
  query ($first: Int, $skip: Int) {
    items: pools(first: $first, skip: $skip, orderBy: "timestamp", orderDirection: "desc") {
      id
      pairId: pair
      isRegular
      allocPoint
    }
  }
`;

export interface MasterchefPoolRaw {
  id: string;
  pairId: Address;
  isRegular: boolean;
  allocPoint: string;
}

type MasterchefPoolsResponse = {
  items: MasterchefPoolRaw[];
};

const MASTERCHEF_USER_FARMS_BY_IDS_QUERY = gql`
  query ($ids: [ID!]) {
    items: users(where: { id_in: $ids }) {
      id
      boostMultiplier
      reward: rewardDebt
      staked: amount
      pool {
        id
        pair
        isRegular
        allocPoint
      }
    }
  }
`;

export interface ExchangePairRaw {
  id: Address;
  token0: {
    id: Address;
    symbol: string;
    decimals: string;
  };
  token1: {
    id: Address;
    symbol: string;
    decimals: string;
  };
  reserve0: string;
  reserve1: string;
}

export type ExchangePairsResponse = {
  items: ExchangePairRaw[];
};

// const queries = {
//   paginatedUserPoolPairs: MASTERCHEF_PAGINATED_USER_POOL_PAIRS_QUERY,
// };

// export default queries;

// export interface QueryResponseType {
//   'masterchef-paginated-user-pool-pairs': MasterchefUserPoolItem;
// }

const keyToQueryMap = {
  'masterchef-masterchefs': MASTERCHEF_MASTERCHEFS_QUERY,
  'masterchef-paginated-user-pool-pairs': MASTERCHEF_PAGINATED_USER_POOL_PAIRS_QUERY,
  'masterchef-paginated-pool-pairs': MASTERCHEF_PAGINATED_POOL_PAIRS_QUERY,
  'masterchef-user-farms-by-ids': MASTERCHEF_USER_FARMS_BY_IDS_QUERY,
};

export default keyToQueryMap;
