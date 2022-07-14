import { gql } from 'graphql-request';

import { Address } from '@/types/app';

import { createFetcher, GraphqlResponse } from '../helpers';

export const fetcherKey = 'masterchef';
export const fetcher = createFetcher(fetcherKey);

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
    }
  }
`;

export interface MasterchefPoolRaw {
  id: string;
  pairId: Address;
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
  'masterchef-paginated-user-pool-pairs': MASTERCHEF_PAGINATED_USER_POOL_PAIRS_QUERY,
  'masterchef-paginated-pool-pairs': MASTERCHEF_PAGINATED_POOL_PAIRS_QUERY,
};

export default keyToQueryMap;
