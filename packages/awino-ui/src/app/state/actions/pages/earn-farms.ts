import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { BigNumber as BN, constants } from 'ethers';
import { chunk, flatten, has } from 'lodash';

import { PAGINATION_PAGE_SIZE } from '@/app/constants';
import { AppState } from '@/app/store';
import multicall from '@/lib/blockchain/common/multicall';
import { erc20AbiJson } from '@/lib/blockchain/erc20/abi/erc20';
import { formatUnits } from '@/lib/formatters';
import fetchQuery from '@/lib/graphql/api';
import { ExchangePairRaw } from '@/lib/graphql/api/exchange';
import { MasterchefMasterchefRaw, MasterchefPoolRaw, MasterchefUserPoolRaw } from '@/lib/graphql/api/masterchef';

import { showMessage } from '../../slices/app';
import { addFarmPairs, addMasterchefs, FarmPair } from '../../slices/masterchef';

import { extendLiquidityPairs } from './helpers';

const { Zero, One, Two, WeiPerEther: Exa } = constants;
const fetchMasterchefGeneralInformation = async (dispatch: Dispatch) => {
  const masterchefs = await fetchQuery<MasterchefMasterchefRaw[]>('masterchef-masterchefs');
  dispatch(addMasterchefs(masterchefs));
};

const getFullDecimalMultiplier = (decimals) => BN.from(10).pow(decimals);

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
    const { address: masterchefAddress, totalRegularAllocPoint: totalRegularAllocPointString } = masterchef;

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

    // [[lpTotalSupply, lpBalanceMC]]
    const multiCalls = stakedPairIds.reduce((ar, stakedPairId) => {
      // lpTotalSupply
      ar.push({
        address: stakedPairId,
        name: 'totalSupply',
        params: [],
      });
      // lpBalanceMC
      ar.push({
        address: stakedPairId,
        name: 'balanceOf',
        params: [masterchefAddress],
      });
      return ar;
    }, []);

    const lpsCalculations = chunk<BN>(
      (await multicall(erc20AbiJson, flatten(multiCalls), provider)).map((m) => m[0]),
      2
    ); // [[lpTotalSupply, lpBalanceMC]]

    // console.log(lpsCalculations);
    currentLiquidityPairs = getState().exchange.liquidityPairs.entities;

    // console.log('lpTokenBalanceMCs', temp, lpsTotalSupply, lpsStakedBalance);
    stakedPairs.map((stakedPair, stakedPairIndex) => {
      // console.log(stakedPair);
      const { allocPoint: allocPointString } = stakedPair;
      const [lpTotalSupply, lpBalanceMC] = lpsCalculations[stakedPairIndex];
      const lpTokenRatio = lpBalanceMC.div(lpTotalSupply);
      const { pairId } = stakedPair;
      const { token0, token1 } = currentLiquidityPairs[pairId];

      // Raw amount of token in the LP, including those not staked
      const token0Reserve = BN.from(new BigNumber(token0.reserve, 10).times(Exa.toString()).toString(10));

      const token1Reserve = BN.from(new BigNumber(token1.reserve, 10).times(Exa.toString()).toString(10));

      const token0AmountTotal = BN.from(token0Reserve).div(getFullDecimalMultiplier(token0.decimals));
      const token1AmountTotal = BN.from(token1Reserve).div(getFullDecimalMultiplier(token1.decimals));

      // Amount of quoteToken in the LP that are staked in the MC
      const token1AmountMC = token1AmountTotal.mul(lpTokenRatio);

      // Total staked in LP, in quote token value
      const lpTotalInQuoteToken = token1AmountMC.mul(Two);

      const allocPoint = BN.from(allocPointString) || Zero;

      const totalRegularAllocPoint = BN.from(totalRegularAllocPointString);
      const poolWeight = totalRegularAllocPoint.gt(0) ? allocPoint.div(totalRegularAllocPoint) : Zero;
      const multiplier = allocPoint.div(100);
      // console.log('test', allocPoint, BN.from(totalRegularAllocPoint));
      (stakedPair as FarmPair).computations = {
        multiplier: multiplier.toString(),
      };
      // console.log(
      //   [
      //     lpTotalSupply,
      //     lpBalanceMC,
      //     lpTokenRatio,
      //     token0AmountTotal,
      //     token1AmountTotal,
      //     token1AmountMC,
      //     lpTotalInQuoteToken,
      //     allocPoint,
      //     poolWeight,
      //     multiplier,
      //   ]
      //     .map((m) => m.toString())
      //     .join('\n')
      // );
    });
    dispatch(addFarmPairs(stakedPairs));

    /*
    define if there are more rows available, by making an assumption that if the requested page size
    is equal to returned item number. This might trigger a request without actual values returned (worst-case scenario).
    */
    const hasMore = stakedPairsLength === pageSize;

    return { ids: stakedPairIds, more: hasMore };
  }
);
