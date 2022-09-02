import { createAsyncThunk } from '@reduxjs/toolkit';

import fetchQuery from '@/lib/graphql/api';
import { ExchangeBriefPairResponse } from '@/lib/graphql/api/exchange';

import { BriefLiquidityPair } from '../slices/exchange';

export const fetchBriefLiquidityPairs = createAsyncThunk('exchange/fetchBriefLiquidityPairs', async () => {
  // fetch brief liquidity pairs
  const briefLiquidityPairsResponse = await fetchQuery<ExchangeBriefPairResponse[]>('exchange-brief-pairs-list');

  return briefLiquidityPairsResponse.map(({ id, token0, token1 }) => ({
    id,
    label: `${token0.symbol}/${token1.symbol}`,
    assets: [token0.symbol, token1.symbol],
  })) as BriefLiquidityPair[];
});
