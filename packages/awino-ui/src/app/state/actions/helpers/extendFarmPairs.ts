import { Web3Provider } from '@ethersproject/providers';
import { Dispatch } from '@reduxjs/toolkit';
import BigNumberJS from 'bignumber.js';
import { BigNumber, utils } from 'ethers';
import { chunk, flatten } from 'lodash';

import { BLOCKS_PER_YEAR, ECR20_TOKEN_DECIMALS } from '@/app/constants';
import { getSymbolsQuotesLatest } from '@/lib/blockchain';
import multicall from '@/lib/blockchain/common/multicall';
import { erc20AbiJson } from '@/lib/blockchain/erc20/abi/erc20';
import { MasterchefFarmResponse } from '@/lib/graphql/api/masterchef';
import { toBigNum } from '@/lib/helpers';

import { LiquidityPair } from '../../slices/exchange';
import { addFarms, MasterchefGeneral } from '../../slices/masterchef';

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param awiPriceUsd Awi price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
const getFarmApr = (
  poolWeight: BigNumberJS,
  awiPriceUsd: BigNumberJS,
  poolLiquidityUsd: BigNumberJS,
  // farmAddress: string,
  regularAwiPerBlock: BigNumberJS
): number /*{ awiRewardsApr: number  lpRewardsApr: number }*/ => {
  const yearlyAwiRewardAllocation = poolWeight
    ? poolWeight.times(regularAwiPerBlock.times(BLOCKS_PER_YEAR))
    : toBigNum(NaN);

  const awiRewardsApr = yearlyAwiRewardAllocation.times(awiPriceUsd).div(poolLiquidityUsd).times(100);

  let awiRewardsAprAsNumber = 0;
  if (!awiRewardsApr.isNaN() && awiRewardsApr.isFinite()) {
    awiRewardsAprAsNumber = awiRewardsApr.toNumber();
  }
  //  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return awiRewardsAprAsNumber; //  { awiRewardsApr: awiRewardsAprAsNumber /* , lpRewardsApr */ };
};

const Zero = toBigNum(0);
const Two = toBigNum(2);

const getFullDecimalMultiplier = (decimals) => toBigNum(10).pow(decimals);

interface Extra {
  masterchef: MasterchefGeneral;
  provider: Web3Provider;
  dispatch: Dispatch;
}

/**
 * Extend masterchef state with:
 *   extended farm pairs data using contract, data-miner and computations
 */
const extendFarmPairs = async (
  stakedPairs: MasterchefFarmResponse[],
  currentLiquidityPairs: Record<string, LiquidityPair>,
  extra: Extra
) => {
  const { dispatch, provider, masterchef } = extra;
  const {
    address: masterchefAddress,
    totalRegularAllocPoint: totalRegularAllocPointString,
    cakeRateToRegularFarm: regularAwiPerBlock,
  } = masterchef;

  let lpsCalculations = [];
  if (provider) {
    // [[lpTotalSupply, lpBalanceMC]]
    const multiCalls = stakedPairs.reduce((ar, { pairId }) => {
      // lpTotalSupply
      ar.push({
        address: pairId,
        name: 'totalSupply',
        params: [],
      });
      // lpBalanceMC
      ar.push({
        address: pairId,
        name: 'balanceOf',
        params: [masterchefAddress],
      });
      return ar;
    }, []);
    lpsCalculations = chunk<BigNumber>(
      (await multicall(erc20AbiJson, flatten(multiCalls), provider)).map((m) => m[0]),
      2
    ); // [[lpTotalSupply, lpBalanceMC]]
  } else {
    const zero = BigNumber.from(0);
    lpsCalculations = stakedPairs.map(() => [zero, zero]);
  }

  // get list of unique token symbols for which price should be fetched from data-miner;
  // filter all that do not have AWI in pair
  const externalSymbols = Array.from(
    new Set(
      stakedPairs.reduce((ar, r) => {
        const { token0, token1 } = currentLiquidityPairs[r.pairId];
        const pairSymbols = [token0.symbol, token1.symbol];
        if (pairSymbols.indexOf('AWI') === -1) {
          ar.push(pairSymbols[0]);
          ar.push(pairSymbols[1]);
        }
        return ar;
      }, [])
    )
  );

  // fetch tokens prices by symbols
  let externalSymbolsUSDPrice = {};
  if (externalSymbols.length) {
    externalSymbolsUSDPrice = await getSymbolsQuotesLatest(externalSymbols);
  }

  const newStakedPairs = stakedPairs.map((stakedPair, stakedPairIndex) => {
    const { allocPoint: allocPointString } = stakedPair;
    const [_lpTotalSupply, _lpBalanceMC] = lpsCalculations[stakedPairIndex];
    const lpTotalSupply = toBigNum(utils.formatUnits(_lpTotalSupply, ECR20_TOKEN_DECIMALS));
    const lpBalanceMC = toBigNum(utils.formatUnits(_lpTotalSupply, ECR20_TOKEN_DECIMALS));

    const lpTokenRatio = lpBalanceMC.div(lpTotalSupply);
    const { pairId } = stakedPair;
    const { token0, token1 } = currentLiquidityPairs[pairId];

    const reserve0 = toBigNum(token0.reserve);
    const reserve1 = toBigNum(token1.reserve);

    const token0AmountTotal = reserve0.div(getFullDecimalMultiplier(token0.decimals));
    const token1AmountTotal = reserve1.div(getFullDecimalMultiplier(token1.decimals));

    // Amount of quoteToken in the LP that are staked in the MC
    const token1AmountMC = token1AmountTotal.times(lpTokenRatio.toString());

    // Total staked in LP, in quote token value
    const lpTotalInQuoteToken = token1AmountMC.times(Two);

    const allocPoint = toBigNum(allocPointString) || Zero;
    const totalRegularAllocPoint = toBigNum(totalRegularAllocPointString);
    const poolWeight = !totalRegularAllocPoint.isZero() ? allocPoint.div(totalRegularAllocPoint) : Zero;
    const multiplier = allocPoint.div(100);

    let token0PriceUSD = Zero;
    let token1PriceUSD = Zero;

    if (token0.symbol === 'AWI' || token1.symbol === 'AWI') {
      token0PriceUSD = reserve0.div(reserve1).times(toBigNum(10).pow(+token0.decimals - +token1.decimals));
      token1PriceUSD = reserve1.div(reserve0).times(toBigNum(10).pow(+token1.decimals - +token0.decimals));
    } else {
      token0PriceUSD = externalSymbolsUSDPrice[token0.symbol];
      token1PriceUSD = externalSymbolsUSDPrice[token1.symbol];
    }

    const totalValueOfLiquidityPoolUSD = reserve0.times(token0PriceUSD).plus(reserve1.times(token1PriceUSD));

    const lpTokenValueUSD = totalValueOfLiquidityPoolUSD.div(lpTotalSupply); // circulatingSupply;

    const apr = getFarmApr(poolWeight, token0PriceUSD, totalValueOfLiquidityPoolUSD, toBigNum(regularAwiPerBlock));

    return {
      ...stakedPair,
      computations: {
        multiplier: multiplier.toString(),
        lpTokenValueUSD: lpTokenValueUSD.toString(),
        totalValueOfLiquidityPoolUSD: totalValueOfLiquidityPoolUSD.toString(),
        apr: toBigNum(apr).toString(),
        lpBalanceMC: lpBalanceMC.toString(),
        // not used
        token0AmountTotal: token0AmountTotal.toString(),
        token1AmountTotal: token0AmountTotal.toString(),
        token1AmountMC: token1AmountMC.toString(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toString(),
      },
    };
    // } ( as FarmPair).
  });

  dispatch(addFarms(newStakedPairs));
};

export default extendFarmPairs;
