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
    }
  }
`;

export type MasterchefMasterchefRaw = {
  address: Address;
  totalRegularAllocPoint: string;
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
      pool {
        id
        pair
        isRegular
        allocPoint
      }
      staked: amount
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
};

export default keyToQueryMap;
