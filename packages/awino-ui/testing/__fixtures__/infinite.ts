import { InfiniteDetailsData } from '@/components/pages/infinite/DetailsSection/DetailsSection';
import { StatsData } from '@/types/app';

export const infiniteStats: StatsData = [{ value: 89.7 }, { value: 0.27 }, { value: 89.7 }, { value: 274463485.5 }];

export const infiniteDetails: InfiniteDetailsData = {
  nextDistributionBlockDate: new Date(2022, 6, 10, 12, 30),
  awinoBalance: 10,
  stats: {
    totalAWILocked: 1234567.89,
    totalAWILockedValue: 123456.78,
    averageUnlockTime: 1234,
    nextDistribution: new Date(2022, 6, 10, 12, 30),
    distribution: 1234567.89,
    distributionValue: 123456.78,
    awiPerInfinity: 0.391,
    apr: 34,
    claimAmount: 10,
  },
  globalVotes: [
    { pair: ['nusd', 'awi'], votes: 12345, percent: 3.66 },
    { pair: ['usdc', 'awi'], votes: 23456, percent: 5 },
    { pair: ['usdt', 'awi'], votes: 34567, percent: 13 },
  ],
};
