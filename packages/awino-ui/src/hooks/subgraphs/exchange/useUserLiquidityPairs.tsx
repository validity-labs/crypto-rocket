import { useEffect, useMemo, useRef, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { ethers, BigNumber } from 'ethers';
import useSWR from 'swr';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addLiquidity, toggleLiquidityLoad } from '@/app/state/slices/exchange';
import { fetchUserBalances, getBalance, getBalanceWithDecimals } from '@/lib/blockchain';
import { erc20AbiJson } from '@/lib/blockchain/erc20/abi/erc20';
import { formatUnits } from '@/lib/formatters';
import {
  ExchangePairItem,
  ExchangePairsResponse,
  // ExchangeUserMintPairItem,
  // ExchangeUserMintPairsResponse,
  EXCHANGE_PAIRS_QUERY,
  // EXCHANGE_USER_MINT_PAIRS_QUERY,
} from '@/lib/graphql/api/exchange';
import { createFetcher } from '@/lib/graphql/helpers';
import { Address } from '@/types/app';

const SUBGRAPH_EXCHANGE_KEY = 'exchange';

const fetcher = createFetcher(SUBGRAPH_EXCHANGE_KEY);

export interface TokenBase {
  id: string;
  symbol: string;
  decimals: string;
  reserve: string;
}

export interface TokenExtended extends TokenBase {
  balance: string;
  balanceFormatted: string;
}

export interface LiquidityShared {
  id: Address;
  // pairId: Address;
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

export type LiquidityPair = LiquidityBase | LiquidityExtended;

interface Params {
  to: Address;
}

// const skip = (page: number) => (page - 1) * PAGINATION_PAGE_SIZE;
// const pager = (page: number) => ({
//   first: PAGINATION_PAGE_SIZE,
//   skip: skip(page),
// });

// const fakeBalance = [1, 1, 1, 0, 0, 0, 1];

const createComplementItemData =
  (account, library) =>
  async (
    item: ExchangePairItem,
    cursor: { current: number },
    index
  ): Promise<{ keep: boolean; data: null | LiquidityPair }> => {
    const { id: pairId, token0, token1, reserve0, reserve1 } = item;
    console.log(pairId, item);
    try {
      const { balance, decimals } = await getBalanceWithDecimals(pairId, account, library);
      // const contract = new ethers.Contract(pairId, erc20AbiJson, library);
      // const balance: BigNumber = /* cursor.current + index < fakeBalance.length
      //     ? ethers.BigNumber.from(fakeBalance[cursor.current + index])
      //     : */ await contract.balanceOf(account);

      console.log('balance', cursor.current + index, balance, pairId);
      // console.log(pairId, token0, token1, id, balance, balance.gt(0));

      if (balance.gt(0)) {
        return {
          keep: true,
          data: {
            id: pairId,
            balance: balance.toString(),
            balanceFormatted: formatUnits(balance, decimals),
            decimals,
            token0: {
              ...token0,
              reserve: reserve0,
            },
            token1: {
              ...token1,
              reserve: reserve1,
            },
            extended: false,
          },
        };
      }
    } catch (err) {
      console.error(err);
    }
    return {
      keep: false,
      data: null,
    };
  };

export const useUserLiquidityPairs = ({ to }: Params) => {
  const cursor = useRef(0);
  const [params, setParams] = useState({
    size: PAGINATION_PAGE_SIZE,
    cursor: cursor.current,
  });

  // console.log('page & data', page, data);
  const { /* account, */ library } = useWeb3React();
  const account = to;
  const dispatch = useAppDispatch();

  useEffect(() => {
    // console.log('params', params);
    dispatch(toggleLiquidityLoad(true));
  }, [params, dispatch]);

  const complementItemData = useMemo(() => {
    return createComplementItemData(account, library);
  }, [account, library]);

  const loadMore = (pageSize = PAGINATION_PAGE_SIZE) => {
    setParams({
      size: pageSize,
      cursor: cursor.current,
    });
  };

  const { data, error } = useSWR<ExchangePairsResponse>(
    [
      EXCHANGE_PAIRS_QUERY,
      {
        first: params.size,
        skip: params.cursor,
      },
    ],
    fetcher,
    {
      refreshInterval: 0,
    }
  );

  useEffect(() => {
    const prepareItems = async () => {
      const allItems = data?.items || [];
      const allItemsLength = allItems.length;
      let filteredItems: LiquidityPair[] = [];

      for (let i = 0; i < allItemsLength; ++i) {
        const { keep, data: complementedItem } = await complementItemData(allItems[i], cursor, i);
        if (keep) {
          filteredItems.push(complementedItem);
        }
      }
      const allbalances = await fetchUserBalances(
        account,
        allItems.map((m) => m.id),
        library
      );
      console.log(allbalances, 'all balances');
      /*
        define if there are more rows available, by making an assumption that if the requested page size
        is equal to returned item number. This might trigger a request without actual values returned (worst-case scenario).
      */
      const hasMore = allItemsLength === params.size;
      // define if amount of filtered items is less than page size, and there is more to request
      const needMore = filteredItems.length < params.size && hasMore;
      // increase cursor by actual rows received
      cursor.current += allItemsLength;

      dispatch(addLiquidity({ items: filteredItems, more: hasMore }));
      if (needMore) {
        const needCount = params.size - filteredItems.length;
        loadMore(needCount);
      } else {
        dispatch(toggleLiquidityLoad(false));
      }
    };

    if (error) {
      dispatch(toggleLiquidityLoad(false));
    } else if (typeof data !== 'undefined') {
      prepareItems();
    }
  }, [data, error, dispatch, complementItemData, params.size]);

  const liquidity = useAppSelector((state) => state.exchange.liquidity);

  return {
    ...liquidity,
    onLoadMore: () => loadMore(),
  };
};
