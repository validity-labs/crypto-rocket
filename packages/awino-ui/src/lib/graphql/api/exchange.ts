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

export const EXCHANGE_USER_MINT_PAIRS_QUERY = gql`
  query ($to: Bytes) {
    items: mints(where: { liquidity_gt: 0, to: $to }) {
      id
      pair {
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
      }
    }
  }
`;

export type ExchangeUserMintPairsResponse = {
  items: {
    id: Address;
    pair: {
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
    };
  }[];
};
