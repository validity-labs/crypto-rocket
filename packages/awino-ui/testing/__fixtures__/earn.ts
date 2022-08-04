import BigNumberJS from 'bignumber.js';

import { FarmItem } from '@/components/pages/earn/farms/ResultSection/ResultSection';
import { LiquidityStakingDetailsData } from '@/components/pages/earn/liquidity-staking/DetailsSection/DetailsSection';
import { ClaimData } from '@/components/pages/earn/manage-awino/ClaimSection/ClaimSection';
import { StakeData } from '@/components/pages/earn/manage-awino/OperationSection/StakeCard';
import { AWINO_DAI_PAIR_ADDRESS_MAP, AWINO_WETH_PAIR_ADDRESS_MAP, ChainId } from '@/lib/blockchain';
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

export const earnManageAwinoClaim: ClaimData = {
  unlockedAWI: { awi: 100, claimable: true },
  vestingAWI: { awi: 100, claimable: false },
  claimAll: { awi: 50, claimable: true },
  expiredLockedAWI: { awi: 100, claimable: true },
};

export const earnFarmsData: FarmItem[] = [
  {
    id: 'awi-dai',
    pair: ['awi', 'dai'],
    label: 'AWI-DAI LP',
    pairBalance: new BigNumberJS('10.0'),
    pairBalanceFormatted: '10.0',
    farmId: '0',
    isRegular: true,
    apr: '1.5',
    multiplier: '1',
    totalValueOfLiquidityPoolUSD: '12345.67',
    lpTokenValueUSD: '123.45',

    boostFactor: '1.0',
    stakedFormatted: '10.0',
    reward: new BigNumberJS('10'),
    rewardFormatted: '10.0',

    // proportion: 1.23,
    type: 'standard',
    staked: new BigNumberJS('10'),
    active: true,
    emissions: ' 123.45',
    aprFarm: '1.23',
    aprLP: '1.23',
    earned: ' 345.67',
    liquidity: '456.78',
    fees: '567.89',
    aprRange: ['1.23', '7.89'],

    // depositFee: '0',
    walletAmount: '234',
    walletAmountUSD: '345',
    contract: AWINO_DAI_PAIR_ADDRESS_MAP[ChainId.TESTNET],
    can: {
      stake: true,
      unstake: true,
      harvest: true,
    },
  },
  {
    id: 'awi-weth',
    pair: ['usdt', 'awi'],
    label: 'USDT-AWI LP',
    pairBalance: new BigNumberJS('10.0'),
    pairBalanceFormatted: '10.0',
    farmId: '0',
    isRegular: true,
    apr: '1.5',
    multiplier: '1',
    totalValueOfLiquidityPoolUSD: '12345.67',
    lpTokenValueUSD: '123.45',

    boostFactor: '1.0',
    stakedFormatted: '10.0',
    reward: new BigNumberJS('10'),
    rewardFormatted: '10.0',

    staked: new BigNumberJS('10'),
    // proportion: 12.3,
    type: 'boosted',
    active: false,
    emissions: '234.56',
    aprFarm: '1.23',
    aprLP: '1.23',
    earned: '456.78',
    liquidity: '567.89',
    fees: '678.9',
    aprRange: ['1.23', '7.89'],
    // depositFee: '0',
    walletAmount: '234',
    walletAmountUSD: '345',
    contract: AWINO_WETH_PAIR_ADDRESS_MAP[ChainId.TESTNET],
    can: {
      stake: true,
      unstake: true,
      harvest: true,
    },
  },
];
