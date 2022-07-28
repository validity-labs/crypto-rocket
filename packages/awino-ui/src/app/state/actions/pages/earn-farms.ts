import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import { has, pick } from 'lodash';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { AppState } from '@/app/store';
import fetchQuery from '@/lib/graphql/api';
import { ExchangePairResponse } from '@/lib/graphql/api/exchange';
import {
  MasterchefMasterchefResponse,
  MasterchefFarmResponse,
  MasterchefUserFarmResponse,
} from '@/lib/graphql/api/masterchef';
import { sleep } from '@/lib/helpers';

import { showMessage } from '../../slices/app';
import { addMasterchefs, addUserFarms } from '../../slices/masterchef';
import extendFarmPairs from '../helpers/extendFarmPairs';
import { extendLiquidityPairs } from '../helpers/extendLiquidityPairs';
import { transformUserFarmPair } from '../helpers/transforms';

const fetchMasterchefGeneralInformation = async (dispatch: Dispatch) => {
  const masterchefsResponse = await fetchQuery<MasterchefMasterchefResponse[]>('masterchef-masterchefs');
  dispatch(addMasterchefs(masterchefsResponse));
};

export const fetchEarnFarms = createAsyncThunk<any, any, { state: AppState }>(
  'pageEarnFarms/fetchEarnFarms',
  async ({ variables, provider, options = {} }, { getState, dispatch }) => {
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
    const currentParams = getState().pageEarnFarms.farms.params;

    let params = {
      first: currentParams.size,
      skip: currentParams.cursor,
    };
    if (more) {
      params.first = pageSize;
    }

    // fetch farms
    const farmsResponse = await fetchQuery<MasterchefFarmResponse[]>('masterchef-paginated-farms', {
      ...params,
    });

    if (account) {
      const userFarmsResponse = (
        await fetchQuery<ExchangePairResponse[]>('masterchef-user-farms-by-ids', {
          ids: farmsResponse.map(({ id }) => `${id}-${account}`),
        })
      ).map(transformUserFarmPair);

      dispatch(addUserFarms(userFarmsResponse));
    }

    let currentLiquidityPairs = getState().exchange.liquidityPairs.entities;

    // filter staked pairs that do not have data for matching liquidity pair
    const missingLiquidityPairIds = farmsResponse
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
    currentLiquidityPairs = getState().exchange.liquidityPairs.entities;

    await extendFarmPairs(farmsResponse, currentLiquidityPairs, {
      dispatch,
      provider,
      masterchef,
    });

    /*
    define if there are more rows available, by making an assumption that if the requested page size
    is equal to returned item number. This might trigger a request without actual values returned (worst-case scenario).
    */
    const hasMore = farmsResponse.length === pageSize;

    return { ids: farmsResponse.map(({ id }) => id), more: hasMore };
  }
);

export const refetchFarm = createAsyncThunk<any, any, { state: AppState }>(
  'pageEarnFarms/refetchFarm',
  async ({ variables, provider, options = {} }, { getState, dispatch }) => {
    // fetch or get masterchef general information
    if (!getState().masterchef.general) {
      await fetchMasterchefGeneralInformation(dispatch);
    }

    const masterchef = getState().masterchef.general;
    if (!masterchef) {
      dispatch(showMessage({ message: 'Insufficient data to proceed.', alertProps: { severity: 'error' } }));
      throw new Error('Masterchef general information is missing.');
    }
    // TODO check if data is not propagated immediately and pause (sleep) is requried;
    // if pause is required for how long is it acceptable
    sleep(3);
    const { id, account } = variables; // id - farmId
    const userFarmId = `${id}-${account}`;

    const userFarmsResponse = await fetchQuery<MasterchefUserFarmResponse[]>('masterchef-user-farms-by-ids', {
      ids: [userFarmId],
    });

    if (userFarmsResponse.length !== 1) {
      dispatch(showMessage({ message: 'Failed to update farm pool information.', alertProps: { severity: 'error' } }));
      throw new Error('Farm pool not found.');
    }

    const userStakedPair = transformUserFarmPair(userFarmsResponse[0]);

    dispatch(addUserFarms([userStakedPair]));

    let currentLiquidityPairs = getState().exchange.liquidityPairs.entities;

    const hasLiquidityPairMatch = has(currentLiquidityPairs, userStakedPair.pairId);
    if (!hasLiquidityPairMatch) {
      // fetch liquidity pair data for missing pairs
      const liquidityPairsResponse = await fetchQuery<ExchangePairResponse[]>('exchange-pairs-by-ids', {
        ids: [userStakedPair.pairId],
      });
      await extendLiquidityPairs(liquidityPairsResponse, {
        account,
        dispatch,
        provider,
      });
    }

    currentLiquidityPairs = getState().exchange.liquidityPairs.entities;

    await extendFarmPairs([userFarmsResponse[0].pool], currentLiquidityPairs, {
      dispatch,
      provider,
      masterchef,
    });

    return { id: userStakedPair.id, operation: 'update' };
  }
);

export const refetchCurrentFarms = createAsyncThunk<any, any, { state: AppState }>(
  'pageEarnFarms/refetchCurrentFarms',
  async ({ variables, provider, options = {} }, { getState, dispatch }) => {
    // fetch or get masterchef general information
    if (!getState().masterchef.general) {
      await fetchMasterchefGeneralInformation(dispatch);
    }

    const masterchef = getState().masterchef.general;
    if (!masterchef) {
      dispatch(showMessage({ message: 'Insufficient data to proceed.', alertProps: { severity: 'error' } }));
      throw new Error('Masterchef general information is missing.');
    }

    const { account } = variables;

    const { ids: farmIds, entities: farmsMap } = getState().masterchef.farms;

    // There is no need to fetch new farms data because only current farms are processed and all required data is alreayd exist; map to get response like farms
    const farmsResponse = farmIds.map((id) => pick(farmsMap[id], ['id', 'pairId', 'isRegular', 'allocPoint']));

    if (account) {
      const userFarmsResponse = (
        await fetchQuery<ExchangePairResponse[]>('masterchef-user-farms-by-ids', {
          ids: farmIds.map((id) => `${id}-${account}`),
        })
      ).map(transformUserFarmPair);

      dispatch(addUserFarms(userFarmsResponse));
    }

    let { ids: currentPairIds, entities: currentPairsMap } = getState().exchange.liquidityPairs;

    // fetch liquidity pair data for missing pairs
    const pairsResponse = await fetchQuery<ExchangePairResponse[]>('exchange-pairs-by-ids', {
      ids: currentPairIds,
    });

    await extendLiquidityPairs(pairsResponse, {
      account,
      dispatch,
      provider,
    });
    /* Note: current implementation do not require updated pairs, as only token info is used later on; still updated pairs are used; */
    currentPairsMap = getState().exchange.liquidityPairs.entities;

    await extendFarmPairs(farmsResponse, currentPairsMap, {
      dispatch,
      provider,
      masterchef,
    });

    return {};
  }
);
