import { createAsyncThunk } from '@reduxjs/toolkit';
import { has } from 'lodash';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { AppState } from '@/app/store';
import { formatUnits } from '@/lib/formatters';
import fetchQuery from '@/lib/graphql/api';
import { ExchangePairRaw } from '@/lib/graphql/api/exchange';
import { MasterchefUserPoolRaw } from '@/lib/graphql/api/masterchef';

import { addFarmPairs, addUserFarmPairs } from '../../slices/masterchef';
import { changeCursorByTypeForPoolPairs } from '../../slices/pages/portfolio';

import { extendLiquidityPairs } from './helpers';

const transformStakedPair = (item: any): any => {
  const {
    pool: { id, pair: pairId, isRegular, allocPoint },
    staked,
  } = item;
  return {
    id,
    pairId,
    isRegular,
    allocPoint,
    staked,
    stakedFormatted: formatUnits(staked, 18),
  };
};

export const fetchPortfolioPoolPairs = createAsyncThunk<any, any, { state: AppState }>(
  'pagePortfolio/fetchPortfolioPoolPairs',
  async ({ variables, provider, options = {} }, { getState, dispatch }) => {
    // TODO only for testing purposes
    // variables.account = '0xbf6562db3526d4be1d3a2b71718e132fb8003e32';
    const { account } = variables;
    // pagination logic
    const { more = true, pageSize = PAGINATION_PAGE_SIZE } = options;
    const { farmsParams, liquidityParams } = getState().pagePortfolio.poolPairs;
    const paramsType = farmsParams.more ? 'farms' : 'liquidity';
    const currentParams = farmsParams.more ? farmsParams : liquidityParams;

    let params = {
      first: currentParams.size,
      skip: currentParams.cursor,
    };
    if (more) {
      params.first = pageSize;
    }

    if (paramsType === 'farms') {
      // fetch farm pool pairs
      const stakedPairs = (
        await fetchQuery<MasterchefUserPoolRaw[]>('masterchef-paginated-user-pool-pairs', { ...variables, ...params })
      ).map(transformStakedPair);

      const stakedPairIds = stakedPairs.map((m) => m.pairId);
      const stakedPairsLength = stakedPairs.length;

      const currentLiquidityPairs = getState().exchange.liquidityPairs.entities;

      // filter staked pairs that do not have data for matching liquidity pair
      const missingLiquidityPairIds = stakedPairIds.filter((pairId) => !has(currentLiquidityPairs, pairId));

      // fetch liquidity pair data for missing pairs
      const rawLiquidityPairs = await fetchQuery<ExchangePairRaw[]>('exchange-pairs-by-ids', {
        ids: missingLiquidityPairIds,
      });

      await extendLiquidityPairs(rawLiquidityPairs, {
        account,
        dispatch,
        provider,
      });

      dispatch(addFarmPairs(stakedPairs));
      dispatch(addUserFarmPairs(stakedPairs));

      /*
        define if there are more rows available, by making an assumption that if the requested page size
        is equal to returned item number. This might trigger a request without actual values returned (worst-case scenario).
      */
      const hasMore = stakedPairsLength === pageSize;

      dispatch(changeCursorByTypeForPoolPairs({ length: stakedPairsLength, type: 'farms' }));

      return { ids: stakedPairIds, more: { farms: hasMore, liquidity: true } };
    } else {
      const stakedPairs = getState().masterchef.userFarmPairs.entities;

      const stakedPairIds = Object.keys(stakedPairs).map((m) => stakedPairs[m].pairId);

      // fetch liquidity pairs (paginated)
      const rawLiquidityPairs = await fetchQuery<ExchangePairRaw[]>('exchange-paginated-pairs-except-ids', {
        ids: stakedPairIds,
        ...params,
      });

      const { /* liquidityPairIds, */ liquidityPairsLength, userLiquidityPairIds, userLiquidityPairsLength } =
        await extendLiquidityPairs(rawLiquidityPairs, {
          account,
          dispatch,
          provider,
        });

      /*
    define if there are more rows available, by making an assumption that if the requested page size
    is equal to returned item number. This might trigger a request without actual values returned (worst-case scenario).
      */
      const hasMore = liquidityPairsLength === pageSize;
      // define if amount of filtered items is less than page size, and there is more to request
      const needMore = userLiquidityPairsLength < pageSize && hasMore;
      // increase cursor by actual rows received

      dispatch(changeCursorByTypeForPoolPairs({ length: liquidityPairsLength, type: 'liquidity' }));

      if (needMore) {
        const needCount = pageSize - userLiquidityPairsLength;
        dispatch(fetchPortfolioPoolPairs({ variables, provider, options: { more: true, pageSize: needCount } }));
      }

      return { ids: userLiquidityPairIds, more: { farms: false, liquidity: hasMore } };
    }
  }
);
