import { gql } from 'graphql-request';

import { Address } from '@/types/app';

import { GraphqlResponse } from '../helpers';

// TODO: stacked balance should be a value of rewardDebt, but amount is used to have temporary value as suggested by @kpaschalidis
export const MASTERCHEF_USER_POOLS_QUERY = gql`
  query ($userAddress: Bytes) {
    items: users(where: { address: $userAddress }) {
      pool {
        id
        pair
      }
      stacked: amount
    }
  }
`;
export interface MasterchefUserPoolItem {
  id: Address;
  pool: {
    id: string;
    pair: Address;
  };
  stacked: string;
}

export type MasterchefUserPoolsResponse = {
  items: MasterchefUserPoolItem[];
};
