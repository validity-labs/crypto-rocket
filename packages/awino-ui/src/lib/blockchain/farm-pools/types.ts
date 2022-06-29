export type FarmPoolInfo = {
  allocPoint: string; // How many allocation points assigned to this pool. SUSHIs to distribute per block.
  lastRewardBlock: number; // Last block number that SUSHIs distribution occurs.
  accTokenPerShare: number; // Accumulated tokens per share
};

export type AccountFarmPoolInfo = {
  amount: string; // Homw many LP tokens the user has provided.
  rewardDebt; // Reward debt.
};

export type FarmTypeKey = 'all' | 'standard' | 'boosted' | 'winawi';

export interface FarmPoolData {
  pid: string;
  tokens: string[];
  proportion: string;
  type: Exclude<FarmTypeKey, 'all'>;
  stacked: boolean;
  active: boolean;
  emissions: string;
  apr: string;
  aprFarm: string;
  aprLP: string;
  earned: string;
  liquidity: string;
  fees: string;
  aprRange: [string, string];
  depositFee: string;
  boostFactor: string;
  lpPrice: string;
}

export interface UserFarmPoolData {
  stakedAmount: string; // Amount of LP tokens staked
  lpAmount: string; // Amount of LP tokens the account holds
}
