import { BigNumberish } from 'ethers';

import { ECR20_TOKEN_DECIMALS } from '@/app/constants';
import { formatUnits } from '@/lib/formatters';

export const transformLiquidityPair = (item: any): any => {
  const { id, token0, token1, reserve0, reserve1 } = item;

  return {
    id,
    token0: {
      ...token0,
      reserve: reserve0,
    },
    token1: {
      ...token1,
      reserve: reserve1,
    },
    totalSupply: null,
  };
};

export const transformUserLiquidityPair = (item: any, balance: BigNumberish): any => {
  return {
    ...item,
    balance: balance.toString(),
    balanceFormatted: formatUnits(balance, ECR20_TOKEN_DECIMALS),
    share: null,
  };
};

export const transformUserFarmPair = (item: any): any => {
  const {
    pool: { id, pairId, isRegular, allocPoint, accCakePerShare },
    staked,
    reward,
    boostMultiplier,
  } = item;

  return {
    id,
    pairId,
    isRegular,
    allocPoint,
    accCakePerShare,
    staked,
    stakedFormatted: formatUnits(staked, ECR20_TOKEN_DECIMALS),
    reward,
    rewardFormatted: formatUnits(reward, ECR20_TOKEN_DECIMALS),
    boostMultiplier,
  };
};
