import { ContractsGrouped } from '@/types/app';

export const contractGroupedList: ContractsGrouped = {
  tokens: [
    {
      key: 'awi',
      address: '0x02D1a756733F2C63DF89bCcB780C0C7A22D4E8a2',
      decimals: 18,
    },
    {
      key: 'infinite',
      address: '0x661fB1B0774Ae54B2f4460C71b66052bC6C05eB2',
      decimals: 18,
    },
    {
      key: 'wealth',
      address: '0x',
      decimals: 18,
    },
  ],
  stableCoins: [
    {
      key: 'dai',
      address: '0x8aBE5006Ac9f44f814621cB3BaE36E4b49393c69',
      decimals: 18,
    },
    {
      key: 'usdc',
      address: '0xd3eef5aace2b9915736F0f493cc47Ea53e90185e',
      decimals: 6,
    },
    {
      key: 'usdt',
      address: '0xeb5b2B71b34B49bA88E18d37E58B26cD56D44870',
      decimals: 6,
    },
  ],
  pools: [
    {
      key: 'awi/dai',
      address: '0x458a4bEb8C8020131591549440eDdE6d2d1c8212',
      decimals: 18,
    },
    {
      key: 'awi/weth',
      address: '0x05Ec7ac6c5E47b23D1CD9E86a4561eC5a8c90BDA',
      decimals: 18,
    },
    {
      key: 'dai/weth',
      address: '0xc339F0a9A4cF523C7914EDE4A6953BF5e52A2b4B',
      decimals: 18,
    },
    // {
    //   key: 'wcro/weth',
    //   address: '0x856Af691aF3A90A88b5483800FFd18FA2f81D712',
    //   decimals: 18,
    // },
  ],
};
