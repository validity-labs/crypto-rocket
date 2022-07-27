import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';

import { ECR20_TOKEN_DECIMALS, PAGINATION_PAGE_SIZE } from '@/app/constants';
import { AppState } from '@/app/store';
import { getBalance, getTotalSupply } from '@/lib/blockchain';
import { formatUnits } from '@/lib/formatters';
import fetchQuery from '@/lib/graphql/api';
import { ExchangePairResponse } from '@/lib/graphql/api/exchange';
import { percentageFor } from '@/lib/helpers';

import { showMessage } from '../../slices/app';
import { removeUserLiquidityPair, updateLiquidityPair, updateUserLiquidityPair } from '../../slices/exchange';
import { changeCursorForUserLiquidityPairs } from '../../slices/pages/swap';
import { extendLiquidityPairs } from '../helpers/extendLiquidityPairs';

export const fetchSwapLiquidity = createAsyncThunk<any, any, { state: AppState }>(
  'pageSwap/fetchSwapLiquidity',
  async ({ variables, provider, options = {} }, { getState, dispatch }) => {
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
    const liquidityPairsResponse = await fetchQuery<ExchangePairResponse[]>('exchange-paginated-pairs', {
      ...variables,
      ...params,
    });

    // fetch balance and update liquidity pair entities
    const { liquidityPairsLength, userLiquidityPairIds, userLiquidityPairsLength } = await extendLiquidityPairs(
      liquidityPairsResponse,
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

export const refetchLiquidityPair = createAsyncThunk<any, any, { state: AppState }>(
  'pageSwap/refetchLiquidityPair',
  async ({ variables, provider, options = {} }, { getState, dispatch }) => {
    const { account, id } = variables;
    // fetch liquidity pair
    const liquidityPairsResponse = await fetchQuery<ExchangePairResponse[]>('exchange-pairs-by-ids', { ids: [id] });

    if (liquidityPairsResponse.length !== 1) {
      dispatch(
        showMessage({ message: 'Failed to update liquidity pair information.', alertProps: { severity: 'error' } })
      );
      throw new Error('Liquidity not found.');
    }
    const pair = liquidityPairsResponse[0];

    const totalSupply = await getTotalSupply(id, account, provider);

    dispatch(
      updateLiquidityPair({
        id,
        data: {
          token0: {
            reserve: pair.reserve0,
          },
          token1: {
            reserve: pair.reserve1,
          },
          totalSupply: totalSupply.toString(),
        },
      })
    );

    const balance = await getBalance(id, account, provider);

    if (balance.gt(0)) {
      dispatch(
        updateUserLiquidityPair({
          id,
          data: {
            balance: balance.toString(),
            balanceFormatted: formatUnits(balance, ECR20_TOKEN_DECIMALS),
            share: percentageFor(BigNumber.from(balance), totalSupply).toString(),
          },
        })
      );
      return { id, operation: 'update' };
    } else {
      dispatch(removeUserLiquidityPair(id));
      return { id, operation: 'remove' };
    }
  }
);
