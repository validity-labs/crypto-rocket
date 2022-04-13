import { LiquidityStakingDetailsData } from '@/components/pages/earn/liquidity-staking/DetailsSection/DetailsSection';
import { ClaimData } from '@/components/pages/earn/manage-awino/ClaimSection/ClaimSection';
import { LockData } from '@/components/pages/earn/manage-awino/OperationSection/LockCard';
import { StakeData } from '@/components/pages/earn/manage-awino/OperationSection/StakeCard';
import { StatsData } from '@/types/app';

export const earnLiquidityStakingStats: StatsData = [{ value: 89.7 }, { value: 0.27 }, { value: 89.7 }];

export const earnLiquidityStakingDetails: LiquidityStakingDetailsData = {
  stakingAPR: 0.54,
  totalRewardsPerDay: 12000.12,
  lpTokenPrice: 456,
  totalRewardsPerWeek: 99992.99,
  totalLPTokensStaked: 120,
};

export const earnManageAwinoStats: StatsData = [
  {
    value: 89.7,
    subValues: [24.72, 45.6],
  },
  { value: 89.7 },
  { value: 0.27 },
  { value: 273.4 },
  { value: 47.4, subValues: [24.72, 45.6] },
];
export const earnManageAwinoStake: StakeData = {
  apr: 39.17,
  balance: {
    geist: 99.99,
    usd: 199.0,
  },
};
export const earnManageAwinoLock: LockData = {
  apr: 39.17,
  balance: {
    geist: 99.99,
    usd: 199.0,
  },
};
export const earnManageAwinoClaim: ClaimData = {
  unlockedAWI: { geist: 100, claimable: true },
  vestingAWI: { geist: 100, claimable: false },
  claimAll: { geist: 50, awi: 100.99, claimable: true },
  expiredLockedAWI: { geist: 100, claimable: true },
};
