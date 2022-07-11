import { useEffect, useMemo, useRef, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import useSWR from 'swr';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
// import { initiateSetLiquidity, setLiquidity } from '@/app/state/slices/exchange';
import { initiateSetUserFarms, setUserFarms } from '@/app/state/slices/masterchef';
import { erc20AbiJson } from '@/lib/blockchain/erc20/abi/erc20';
import { formatUnits } from '@/lib/formatters';
import { ExchangeUserMintPairsResponse, EXCHANGE_USER_MINT_PAIRS_QUERY } from '@/lib/graphql/api/exchange';
import {
  MasterchefUserPoolItem,
  MasterchefUserPoolsResponse,
  MASTERCHEF_USER_POOLS_QUERY,
} from '@/lib/graphql/api/masterchef';
import { createFetcher } from '@/lib/graphql/helpers';
import { Address } from '@/types/app';

const SUBGRAPH_MASTERCHEF_KEY = 'masterchef';

const fetcher = createFetcher(SUBGRAPH_MASTERCHEF_KEY);

// export interface TokenBase {
//   id: string;
//   symbol: string;
//   decimals: string;
// }

// export interface TokenExtended extends TokenBase {
//   balance: string;
//   balanceFormatted: string;
// }

// export interface LiquidityShared {
//   id: Address;
//   pairId: Address;
//   balance: string;
//   balanceFormatted: string;
//   decimals: number;
// }

// export interface LiquidityBase extends LiquidityShared {
//   token0: TokenBase;
//   token1: TokenBase;
//   extended: false;
// }

// export interface LiquidityExtended extends LiquidityShared {
//   token0: TokenExtended;
//   token1: TokenExtended;
//   extended: true;
//   share: string;
// }

// export type Liquidity = LiquidityBase | LiquidityExtended;
interface UserPool {}
const createComplementItemData =
  (account, library) =>
  async (
    item: MasterchefUserPoolItem,
    cursor: { current: number },
    index
  ): Promise<{ keep: boolean; data: null | UserPool }> => {
    // const {
    //   id,
    //   pool: { id: farmId, pair: liquidityId },
    //   stacked,
    // } = tmpData[i];

    // //           items: {
    // //   id: Address;
    // //   pool: {
    // //     id: string;
    // //     pair: Address;
    // //   };
    // //   stacked: string;
    // // }[];
    // console.log(id, farmId, liquidityId, stacked);
    // const stackedValue = ethers.utils.parseUnits(stacked);
    // if (stackedValue.gt(0)) {
    // }

    // const {
    //   id,
    //   pair: { id: pairId, token0, token1 },
    // } = item;

    try {
      throw new Error('Todo:  Implement');
      // const contract = new ethers.Contract(pairId, erc20AbiJson, library);
      // const balance: BigNumber = /* cursor.current + index < fakeBalance.length
      //     ? ethers.BigNumber.from(fakeBalance[cursor.current + index])
      //     : */ await contract.balanceOf(account);

      // console.log('balance', cursor.current + index, balance, pairId);
      // // console.log(pairId, token0, token1, id, balance, balance.gt(0));

      // if (balance.gt(0)) {
      //   const decimals = await contract.decimals();
      //   return {
      //     keep: true,
      //     data: {
      //       id,
      //       pairId,
      //       balance: balance.toString(),
      //       balanceFormatted: formatUnits(balance, decimals),
      //       decimals,
      //       token0,
      //       token1,
      //       extended: false,
      //     },
      //   };
      // }
    } catch (err) {
      console.error(err);
    }
    return {
      keep: false,
      data: null,
    };
  };

export const useUserPools = () => {
  const cursor = useRef(0);
  const [params, setParams] = useState({
    size: PAGINATION_PAGE_SIZE,
    cursor: cursor.current,
  });

  // console.log('page & data', page, data);
  const { account, library } = useWeb3React();
  // const account = '0xbf6562db3526d4be1d3a2b71718e132fb8003e32';
  const dispatch = useAppDispatch();

  useEffect(() => {
    // console.log('params', params);
    // dispatch(toggleLiquidityLoad(true));
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

  const { data, error } = useSWR<MasterchefUserPoolsResponse>(
    [
      MASTERCHEF_USER_POOLS_QUERY,
      {
        userAddress: account,
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
      let filteredItems: any[] = [];

      for (let i = 0; i < allItemsLength; ++i) {
        const { keep, data: complementedItem } = await complementItemData(allItems[i], cursor, i);
        if (keep) {
          filteredItems.push(complementedItem);
        }
      }
      /*
        define if there are more rows available, by making an assumption that if the requested page size
        is equal to returned item number. This might trigger a request without actual values returned (worst-case scenario).
      */
      const hasMore = allItemsLength === params.size;
      // define if amount of filtered items is less than page size, and there is more to request
      const needMore = filteredItems.length < params.size && hasMore;
      // increase cursor by actual rows received
      cursor.current += allItemsLength;

      // dispatch(addLiquidity({ items: filteredItems, more: hasMore }));
      if (needMore) {
        const needCount = params.size - filteredItems.length;
        loadMore(needCount);
      } else {
        // dispatch(toggleLiquidityLoad(false));
      }
    };

    if (error) {
      // dispatch(toggleLiquidityLoad(false));
    } else if (typeof data !== 'undefined') {
      prepareItems();
    }
  }, [data, error, dispatch, complementItemData, params.size]);

  const userFarms = useAppSelector((state) => state.masterchef.userFarms);

  return {
    ...userFarms,
    onLoadMore: () => loadMore(),
  };
};
