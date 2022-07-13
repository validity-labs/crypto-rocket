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

// const queries = {
//   paginatedUserPoolPairs: MASTERCHEF_PAGINATED_USER_POOL_PAIRS_QUERY,
// };

// export default queries;

// export interface QueryResponseType {
//   'masterchef-paginated-user-pool-pairs': MasterchefUserPoolItem;
// }

const keyToQueryMap = {
  'masterchef-paginated-user-pool-pairs': MASTERCHEF_PAGINATED_USER_POOL_PAIRS_QUERY,
};

export default keyToQueryMap;
