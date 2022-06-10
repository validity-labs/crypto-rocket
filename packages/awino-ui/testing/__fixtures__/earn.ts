import { FarmDataItem } from '@/components/pages/earn/farms/ResultSection/ResultSection';
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
    awi: 99.99,
    usd: 199.0,
  },
};
export const earnManageAwinoLock: LockData = {
  apr: 39.17,
  balance: {
    awi: 99.99,
    usd: 199.0,
  },
};
export const earnManageAwinoClaim: ClaimData = {
  unlockedAWI: { awi: 100, claimable: true },
  vestingAWI: { awi: 100, claimable: false },
  claimAll: { awi: 50, awi: 100.99, claimable: true },
  expiredLockedAWI: { awi: 100, claimable: true },
};

export const earnFarmsData: FarmDataItem[] = [
  {
    id: 'usdc-awi',
    pair: ['usdc', 'awi'],
    proportion: 1.23,
    type: 'standard',
    stacked: true,
    active: true,
    emissions: 123.45,
    apr: 7.89,
    aprFarm: 1.23,
    aprLP: 1.23,
    earned: 345.67,
    liquidity: 456.78,
    fees: 567.89,
    aprRange: [1.23, 7.89],
    depositFee: 0,
    boostFactor: 1.0,
    lpPrice: 123.45,
  },
  {
    id: 'usdt-awi',
    pair: ['usdt', 'awi'],
    proportion: 12.3,
    type: 'boosted',
    stacked: false,
    active: false,
    emissions: 234.56,
    apr: 1.23,
    aprFarm: 1.23,
    aprLP: 1.23,
    earned: 456.78,
    liquidity: 567.89,
    fees: 678.9,
    aprRange: [1.23, 7.89],
    depositFee: 0,
    boostFactor: 1.0,
    lpPrice: 123.45,
  },
  {
    id: 'nusd-awi',
    pair: ['nusd', 'awi'],
    proportion: 1.23,
    type: 'standard',
    stacked: true,
    active: true,
    emissions: 123.45,
    apr: 7.89,
    aprFarm: 1.23,
    aprLP: 1.23,
    earned: 345.67,
    liquidity: 456.78,
    fees: 567.89,
    aprRange: [1.23, 7.89],
    depositFee: 0,
    boostFactor: 1.0,
    lpPrice: 123.45,
  },
  {
    id: 'eth-awi',
    pair: ['eth', 'awi'],
    proportion: 12.3,
    type: 'boosted',
    stacked: false,
    active: false,
    emissions: 234.56,
    apr: 1.23,
    aprFarm: 1.23,
    aprLP: 1.23,
    earned: 456.78,
    liquidity: 567.89,
    fees: 678.9,
    aprRange: [1.23, 7.89],
    depositFee: 0,
    boostFactor: 1.0,
    lpPrice: 123.45,
  },
];
