import { Web3Provider } from '@ethersproject/providers';
import { Dispatch } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';

import { fetchUserBalances } from '@/lib/blockchain';
import { ExchangePairRaw } from '@/lib/graphql/api/exchange';
import { Address } from '@/types/app';

import { addLiquidityPairs, addUserLiquidityPairs, LiquidityPair } from '../../slices/exchange';

import { transformLiquidityPair, transformUserLiquidityPair } from './transforms';

interface LiquidityPairsExtra {
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

/**
 * Extend exchange state with:
 *   extended liquidity pairs data including balance
 *   extended user liquidity pairs data filtered by positive balance and
 * transformed
 * @param rawPairs
 * @param extra
 * @returns
 */
export const extendLiquidityPairs = async (
  rawPairs: ExchangePairRaw[],
  extra: LiquidityPairsExtra
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
