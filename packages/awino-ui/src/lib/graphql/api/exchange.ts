import { gql } from 'graphql-request';

import { Address } from '@/types/app';

import { createFetcher, GraphqlResponse } from '../helpers';

export const fetcherKey = 'exchange';
export const fetcher = createFetcher(fetcherKey);

export const EXCHANGE_TOKENS_QUERY = gql`
  query () {
    items: tokens {
      address: id
      name
      symbol
      decimals
    }
  }
`;

export type ExchangeTokensResponse = GraphqlResponse<{
  items: {
    address: Address;
    name: string;
    symbol: string;
    decimals: string;
  }[];
}>;

export const EXCHANGE_BRIEF_PAIRS_LIST_QUERY = gql`
  query {
    items: pairs(orderBy: "timestamp", orderDirection: "desc") {
      id
      token0 {
        symbol
      }
      token1 {
        symbol
      }
    }
  }
`;

export interface ExchangeBriefPairResponse {
  id: Address;
  token0: {
    // id: Address;
    symbol: string;
    // decimals: string;
  };
  token1: {
    // id: Address;
    symbol: string;
    // decimals: string;
  };
}

export type ExchangeBriefPairsResponse = {
  items: ExchangeBriefPairResponse[];
};
// export const EXCHANGE_USER_MINT_PAIRS_QUERY = gql`
//   query ($to: Bytes, $first: Int, $skip: Int) {
//     items: mints(
//       first: $first
//       skip: $skip
//       where: { liquidity_gt: 0, to: $to }
//       orderBy: "timestamp"
//       orderDirection: "desc"
//     ) {
//       id
//       pair {
//         id
//         token0 {
//           id
//           symbol
//           decimals
//         }
//         token1 {
//           id
//           symbol
//           decimals
//         }
//       }
//     }
//   }
// `;

// export interface ExchangeUserMintPairItem {
//   id: Address;
//   pair: {
//     id: Address;
//     token0: {
//       id: Address;
//       symbol: string;
//       decimals: string;
//     };
//     token1: {
//       id: Address;
//       symbol: string;
//       decimals: string;
//     };
//   };
// }

// export type ExchangeUserMintPairsResponse = {
//   items: ExchangeUserMintPairItem[];
// };

export const EXCHANGE_PAGINATED_PAIRS_QUERY = gql`
  query ($first: Int, $skip: Int) {
    items: pairs(first: $first, skip: $skip, orderBy: "timestamp", orderDirection: "desc") {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      reserve0
      reserve1
    }
  }
`;

const EXCHANGE_PAGINATED_PAIRS_EXCEPT_IDS_QUERY = gql`
  query ($ids: [ID!], $first: Int, $skip: Int) {
    items: pairs(where: { id_not_in: $ids }, first: $first, skip: $skip, orderBy: "timestamp", orderDirection: "desc") {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      reserve0
      reserve1
    }
  }
`;
export interface ExchangePairResponse {
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
  items: ExchangePairResponse[];
};

const EXCHANGE_PAIRS_QUERY_BY_IDS = gql`
  query ($ids: [ID!]) {
    items: pairs(where: { id_in: $ids }, orderBy: "timestamp", orderDirection: "desc") {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      reserve0
      reserve1
    }
  }
`;

// const queries = {
//   paginatedPairs: EXCHANGE_PAGINATED_PAIRS_QUERY,
//   pairsByIds: EXCHANGE_PAIRS_QUERY_BY_IDS,
// };
// export interface QueryResponseType {
//   'exchange-paginated-pairs': ExchangePairItem;
//   'exchange-paginated-pairs-except-ids': ExchangePairItem;
//   'exchange-pairs-by-ids': ExchangePairItem;
// }

const keyToQueryMap = {
  'exchange-brief-pairs-list': EXCHANGE_BRIEF_PAIRS_LIST_QUERY,
  'exchange-paginated-pairs': EXCHANGE_PAGINATED_PAIRS_QUERY,
  'exchange-paginated-pairs-except-ids': EXCHANGE_PAGINATED_PAIRS_EXCEPT_IDS_QUERY,
  'exchange-pairs-by-ids': EXCHANGE_PAIRS_QUERY_BY_IDS,
};
export default keyToQueryMap;

// const tokenBalances = tokens.reduce((acc, token, index) => ({  [token]: tokenBalancesRaw[index] }), {})
