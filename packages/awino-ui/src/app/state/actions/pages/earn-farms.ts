import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import { has } from 'lodash';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { AppState } from '@/app/store';
import fetchQuery from '@/lib/graphql/api';
import { ExchangePairRaw } from '@/lib/graphql/api/exchange';
import { MasterchefMasterchefRaw, MasterchefPoolRaw } from '@/lib/graphql/api/masterchef';

import { showMessage } from '../../slices/app';
import { addMasterchefs, addUserFarmPairs } from '../../slices/masterchef';
import extendFarmPairs from '../helpers/extendFarmPairs';
import { extendLiquidityPairs } from '../helpers/extendLiquidityPairs';
import { transformUserFarmPair } from '../helpers/transforms';

const fetchMasterchefGeneralInformation = async (dispatch: Dispatch) => {
  const masterchefs = await fetchQuery<MasterchefMasterchefRaw[]>('masterchef-masterchefs');
  dispatch(addMasterchefs(masterchefs));
};

export const fetchEarnFarmsPoolPairs = createAsyncThunk<any, any, { state: AppState }>(
  'pageEarnFarms/fetchEarnFarmsPoolPairs',
  async ({ variables, provider, options = {} }, { getState, dispatch, rejectWithValue }) => {
    // fetch or get masterchef general information
    if (!getState().masterchef.general) {
      await fetchMasterchefGeneralInformation(dispatch);
    }

    const masterchef = getState().masterchef.general;
    if (!masterchef) {
      dispatch(showMessage({ message: 'Insufficient data to proceed.', alertProps: { severity: 'error' } }));
      throw new Error('Masterchef general information is missing.');
    }

    // TODO only for testing purposes
    // variables.account = '0xbf6562db3526d4be1d3a2b71718e132fb8003e32';
    const { account } = variables;
    // pagination logic
    const { more = true, pageSize = PAGINATION_PAGE_SIZE } = options;
    const currentParams = getState().pageEarnFarms.poolPairs.params;

    let params = {
      first: currentParams.size,
      skip: currentParams.cursor,
    };
    if (more) {
      params.first = pageSize;
    }

    // fetch farm pool pairs
    const stakedPairs = await fetchQuery<MasterchefPoolRaw[]>('masterchef-paginated-pool-pairs', {
      ...variables,
      ...params,
    });

    const stakedPairIds = stakedPairs.map((m) => m.pairId);
    const stakedPairsLength = stakedPairs.length;

    const userStakedPairs = (
      await fetchQuery<ExchangePairRaw[]>('masterchef-user-farms-by-ids', {
        ids: stakedPairs.map(({ id }) => `${id}-${account}`),
      })
    ).map(transformUserFarmPair);

    dispatch(addUserFarmPairs(userStakedPairs));

    console.log('userStakedPairs', userStakedPairs);

    let currentLiquidityPairs = getState().exchange.liquidityPairs.entities;

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

    currentLiquidityPairs = getState().exchange.liquidityPairs.entities;

    await extendFarmPairs(stakedPairs, currentLiquidityPairs, {
      dispatch,
      provider,
      masterchef,
    });

    /*
    define if there are more rows available, by making an assumption that if the requested page size
    is equal to returned item number. This might trigger a request without actual values returned (worst-case scenario).
    */
    const hasMore = stakedPairsLength === pageSize;

    return { ids: stakedPairIds, more: hasMore };
  }
);
