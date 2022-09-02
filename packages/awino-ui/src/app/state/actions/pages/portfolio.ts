import { createAsyncThunk } from '@reduxjs/toolkit';
import { has } from 'lodash';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { AppState } from '@/app/store';
import fetchQuery from '@/lib/graphql/api';
import { ExchangePairResponse } from '@/lib/graphql/api/exchange';
import { MasterchefUserFarmResponse } from '@/lib/graphql/api/masterchef';

import { addFarms, addUserFarms } from '../../slices/masterchef';
import { changeCursorByTypeForPairs } from '../../slices/pages/portfolio';
import { extendLiquidityPairs } from '../helpers/extendLiquidityPairs';
import { transformUserFarmPair } from '../helpers/transforms';

export const fetchPortfolioPairs = createAsyncThunk<any, any, { state: AppState }>(
  'pagePortfolio/fetchPortfolioPairs',
  async ({ variables, provider, options = {} }, { getState, dispatch }) => {
    // TODO only for testing purposes
    // variables.account = '0xbf6562db3526d4be1d3a2b71718e132fb8003e32';
    const { account } = variables;
    // pagination logic
    const { more = true, pageSize = PAGINATION_PAGE_SIZE } = options;
    const { farmsParams, liquidityParams } = getState().pagePortfolio.pairs;
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
      const userFarmsResponse = (
        await fetchQuery<MasterchefUserFarmResponse[]>('masterchef-paginated-user-farms', {
          ...variables,
          ...params,
        })
      ).map(transformUserFarmPair);

      const userFarmsResponseLength = userFarmsResponse.length;

      const currentLiquidityPairs = getState().exchange.liquidityPairs.entities;

      // filter staked pairs that do not have data for matching liquidity pair
      const missingLiquidityPairIds = userFarmsResponse
        .filter(({ pairId }) => !has(currentLiquidityPairs, pairId))
        .map(({ pairId }) => pairId);

      // fetch liquidity pair data for missing pairs
      const liquidityPairsResponse = await fetchQuery<ExchangePairResponse[]>('exchange-pairs-by-ids', {
        ids: missingLiquidityPairIds,
      });

      await extendLiquidityPairs(liquidityPairsResponse, {
        account,
        dispatch,
        provider,
      });
      dispatch(addFarms(userFarmsResponse));
      dispatch(addUserFarms(userFarmsResponse));

      /*
        define if there are more rows available, by making an assumption that if the requested page size
        is equal to returned item number. This might trigger a request without actual values returned (worst-case scenario).
      */
      const hasMore = userFarmsResponseLength === pageSize;

      dispatch(changeCursorByTypeForPairs({ length: userFarmsResponseLength, type: 'farms' }));

      return { ids: userFarmsResponse.map(({ pairId }) => pairId), more: { farms: hasMore, liquidity: true } };
    } else {
      const userFarmsMap = getState().masterchef.userFarms.entities;

      const userFarmsPairIds = Object.keys(userFarmsMap).map((m) => userFarmsMap[m].pairId);

      // fetch liquidity pairs (paginated)
      const liquidityPairsResponse = await fetchQuery<ExchangePairResponse[]>('exchange-paginated-pairs-except-ids', {
        ids: userFarmsPairIds,
        ...params,
      });

      const { /* liquidityPairIds, */ liquidityPairsLength, userLiquidityPairIds, userLiquidityPairsLength } =
        await extendLiquidityPairs(liquidityPairsResponse, {
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

      dispatch(changeCursorByTypeForPairs({ length: liquidityPairsLength, type: 'liquidity' }));

      if (needMore) {
        const needCount = pageSize - userLiquidityPairsLength;
        dispatch(fetchPortfolioPairs({ variables, provider, options: { more: true, pageSize: needCount } }));
      }

      return { ids: userLiquidityPairIds, more: { farms: false, liquidity: hasMore } };
    }
  }
);
