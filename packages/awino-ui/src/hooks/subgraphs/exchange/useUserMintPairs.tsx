import { useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';
import { ethers, BigNumber } from 'ethers';
import useSWR from 'swr';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { initiateSetLiquidity, setLiquidity } from '@/app/state/slices/exchange';
import { erc20AbiJson } from '@/lib/blockchain/erc20/abi/erc20';
import { formatUnits } from '@/lib/formatters';
import { ExchangeUserMintPairsResponse, EXCHANGE_USER_MINT_PAIRS_QUERY } from '@/lib/graphql/api/exchange';
import { createFetcher } from '@/lib/graphql/helpers';
import { Address } from '@/types/app';

const SUBGRAPH_EXCHANGE_KEY = 'exchange';

const fetcher = createFetcher(SUBGRAPH_EXCHANGE_KEY);

export interface TokenBase {
  id: string;
  symbol: string;
  decimals: string;
}

export interface TokenExtended extends TokenBase {
  balance: string;
  balanceFormatted: string;
}

export interface LiquidityShared {
  id: Address;
  pairId: Address;
  balance: string;
  balanceFormatted: string;
  decimals: number;
}

export interface LiquidityBase extends LiquidityShared {
  token0: TokenBase;
  token1: TokenBase;
  extended: false;
}

export interface LiquidityExtended extends LiquidityShared {
  token0: TokenExtended;
  token1: TokenExtended;
  extended: true;
  share: string;
}

export type Liquidity = LiquidityBase | LiquidityExtended;

export const useUserMintPairs = ({ to }: { to: Address }) => {
  const { data, error } = useSWR<ExchangeUserMintPairsResponse>([EXCHANGE_USER_MINT_PAIRS_QUERY, { to }], fetcher, {
    refreshInterval: 0,
  });

  const { account, library } = useWeb3React();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const prepareItems = async () => {
      let newItems: Liquidity[] = [];
      if (!error) {
        const tmpData = data?.items || [];
        const ln = tmpData.length;

        for (let i = 0; i < ln; ++i) {
          const {
            id,
            pair: { id: pairId, token0, token1 },
          } = tmpData[i];

          try {
            const contract = new ethers.Contract(pairId, erc20AbiJson, library);
            const balance: BigNumber = await contract.balanceOf(account);

            if (balance.gt(0)) {
              const decimals = await contract.decimals();
              newItems.push({
                id,
                pairId,
                balance: balance.toString(),
                balanceFormatted: formatUnits(balance, decimals),
                decimals,
                token0,
                token1,
                extended: false,
              });
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
      dispatch(setLiquidity(newItems));
    };
    dispatch(initiateSetLiquidity());
    prepareItems();
  }, [data, error, dispatch, library]);

  const liquidity = useAppSelector((state) => state.exchange.liquidity);

  return liquidity;
};
