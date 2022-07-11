import { gql } from 'graphql-request';

import { Address } from '@/types/app';

import { GraphqlResponse } from '../helpers';

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

export const EXCHANGE_PAIRS_QUERY = gql`
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

export interface ExchangePairItem {
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
  items: ExchangePairItem[];
};
