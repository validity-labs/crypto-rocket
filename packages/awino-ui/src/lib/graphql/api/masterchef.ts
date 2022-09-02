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

export type MasterchefMasterchefResponse = {
  address: Address;
  totalRegularAllocPoint: string;
  cakeRateToRegularFarm: string;
};
export type MasterchefMasterchefsResponse = {
  items: MasterchefMasterchefResponse[];
};

// TODO: staked balance should be a value of rewardDebt, but amount is used to have temporary value as suggested by @kpaschalidis
const MASTERCHEF_PAGINATED_USER_FARMS_QUERY = gql`
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
        pairId: pair
        isRegular
        allocPoint
        accCakePerShare
      }
    }
  }
`;
export interface MasterchefUserFarmResponse {
  id: Address;
  pool: {
    id: string;
    pairId: Address;
    isRegular: boolean;
    allocPoint: string;
    accCakePerShare: string;
  };
  staked: string;
}

type MasterchefUserFarmsResponse = {
  items: MasterchefUserFarmResponse[];
};

// query ($ids: [ID!], $first: Int, $skip: Int) {
//   items: pairs(where: { id_not_in: $ids }, first: $first, skip: $skip, orderBy: "timestamp", orderDirection: "desc") {
const MASTERCHEF_PAGINATED_FARMS_QUERY = gql`
  query ($first: Int, $skip: Int) {
    items: pools(first: $first, skip: $skip, orderBy: "timestamp", orderDirection: "desc") {
      id
      pairId: pair
      isRegular
      allocPoint
      accCakePerShare
    }
  }
`;

export interface MasterchefFarmResponse {
  id: string;
  pairId: Address;
  isRegular: boolean;
  allocPoint: string;
  accCakePerShare: string;
}

type MasterchefFarmsResponse = {
  items: MasterchefFarmResponse[];
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
        pairId: pair
        isRegular
        allocPoint
        accCakePerShare
      }
    }
  }
`;

const keyToQueryMap = {
  'masterchef-masterchefs': MASTERCHEF_MASTERCHEFS_QUERY,
  'masterchef-paginated-user-farms': MASTERCHEF_PAGINATED_USER_FARMS_QUERY,
  'masterchef-paginated-farms': MASTERCHEF_PAGINATED_FARMS_QUERY,
  'masterchef-user-farms-by-ids': MASTERCHEF_USER_FARMS_BY_IDS_QUERY,
};

export default keyToQueryMap;
