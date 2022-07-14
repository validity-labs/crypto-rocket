import { createAsyncThunk } from '@reduxjs/toolkit';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { AppState } from '@/app/store';
import fetchQuery from '@/lib/graphql/api';
import { ExchangePairRaw } from '@/lib/graphql/api/exchange';

import { changeCursorForUserLiquidityPairs } from '../../slices/pages/swap';

import { extendLiquidityPairs } from './helpers';

export const fetchSwapLiquidity = createAsyncThunk<any, any, { state: AppState }>(
  'pageSwap/fetchSwapLiquidity',
  async ({ variables, provider, options = {} }, { getState, dispatch }) => {
    // TODO only for testing purposes
    // variables.account = '0xbf6562db3526d4be1d3a2b71718e132fb8003e32';
    const account = variables.account;
    // pagination logic
    const { more = true, pageSize = PAGINATION_PAGE_SIZE } = options;
    const currentParams = getState().pageSwap.liquidity.params;
    let params = {
      first: currentParams.size,
      skip: currentParams.cursor,
    };
    if (more) {
      params.first = pageSize;
    }

    // fetch liquidity pairs (paginated)
    const rawLiquidityPairs = await fetchQuery<ExchangePairRaw[]>('exchange-paginated-pairs', {
      ...variables,
      ...params,
    });

    // fetch balance and update liquidity pair entities
    const { liquidityPairsLength, userLiquidityPairIds, userLiquidityPairsLength } = await extendLiquidityPairs(
      rawLiquidityPairs,
      {
        account,
        dispatch,
        provider,
      }
    );

    /*
    define if there are more rows available, by making an assumption that if the requested page size
    is equal to returned item number. This might trigger a request without actual values returned (worst-case scenario).
      */
    const hasMore = liquidityPairsLength === pageSize;
    // define if amount of filtered items is less than page size, and there is more to request
    const needMore = userLiquidityPairsLength < pageSize && hasMore;
    // increase cursor by actual rows received

    dispatch(changeCursorForUserLiquidityPairs(liquidityPairsLength));

    if (needMore) {
      const needCount = pageSize - userLiquidityPairsLength;
      dispatch(fetchSwapLiquidity({ variables, provider, options: { more: true, pageSize: needCount } }));
    }

    return { ids: userLiquidityPairIds, more: hasMore };
  }
);
