import { BalanceGrouped } from '@/types/app';

export const balanceGroupedList: BalanceGrouped = {
  tokens: [
    {
      key: 'awi',
      total: 23.45,
    },
    {
      key: 'infinite',
      total: 93.45,
    },
    {
      key: 'wealth',
      total: 123.45,
    },
  ],
  stableCoins: [
    {
      key: 'dai',
      total: 123.45,
    },
    {
      key: 'usdc',
      total: 123.45,
    },
    {
      key: 'usdt',
      total: 123.45,
    },
  ],
  pool: [
    {
      key: 'nusd',
      total: 34.55,
      staked: 45.6,
      assets: ['dai', 'usdc', 'usdt'],
    },
    {
      key: 'xusd',
      total: 10,
      staked: 60,
      assets: ['awi', 'infinite', 'wealth'],
    },
  ],
};
