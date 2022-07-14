import { Web3Provider } from '@ethersproject/providers';
import { Dispatch } from '@reduxjs/toolkit';
import { BigNumber, utils } from 'ethers';

import { fetchUserBalances } from '@/lib/blockchain';
import { formatUnits } from '@/lib/formatters';
import { ExchangePairRaw } from '@/lib/graphql/api/exchange';
import { Address } from '@/types/app';

import { addLiquidityPairs, addUserLiquidityPairs, LiquidityPair } from '../../slices/exchange';
const transformLiquidityPair = (item: any): any => {
  const { id, token0, token1, reserve0, reserve1 } = item;
  return {
    id,
    token0: {
      ...token0,
      reserve: reserve0,
    },
    token1: {
      ...token1,
      reserve: reserve1,
    },
    totalSupply: null,
  };
};

export const transformUserLiquidityPair = (item: any, balance: BigNumber): any => {
  return {
    ...item,
    balance: balance.toString(),
    balanceFormatted: formatUnits(balance, 18),
    share: null,
  };
};

interface Extra {
  account: string;
  provider: Web3Provider;
  dispatch: Dispatch;
}

interface ExtendLiquidityPairsReturnType {
  liquidityPairIds: Address[];
  liquidityPairsLength: number;
  userLiquidityPairIds: Address[];
  userLiquidityPairsLength: number;
}

export const extendLiquidityPairs = async (
  rawPairs: ExchangePairRaw[],
  extra: Extra
): Promise<ExtendLiquidityPairsReturnType> => {
  const { account, provider, dispatch } = extra;
  // transform liquidity pair
  const pairs = rawPairs.map(transformLiquidityPair);
  const pairsLength = pairs.length;
  const pairIds = pairs.map((m) => m.id);
  // fetch user balances for each pair
  const allBalances: [BigNumber][] = await fetchUserBalances(account, pairIds, provider);

  // user pairs is only concerned about ones that have balance > 0
  const userPairs = pairs
    .filter((_item, itemIndex) => {
      return allBalances[itemIndex][0].gt(0);
    })
    .map((item, itemIndex) => {
      // extend user pairs with balance and optional fields
      return transformUserLiquidityPair(item, allBalances[itemIndex][0]);
    });

  dispatch(addLiquidityPairs(pairs));
  dispatch(addUserLiquidityPairs(userPairs));

  const userPairIds = userPairs.map((m) => m.id);
  return {
    liquidityPairIds: pairIds,
    liquidityPairsLength: pairIds.length,
    userLiquidityPairIds: userPairIds,
    userLiquidityPairsLength: userPairIds.length,
  };
};
