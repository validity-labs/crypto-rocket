import { ChainId } from '../common/constants';

export const AWINO_USDT_PAIR_ADDRESS_MAP = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: '0xcf95686A48288b802FbD86427093b0E153949ec0',
};

export const AWINO_DAI_PAIR_ADDRESS_MAP = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: '0x458a4bEb8C8020131591549440eDdE6d2d1c8212',
};

export const AWINO_WETH_PAIR_ADDRESS_MAP = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: '0x05Ec7ac6c5E47b23D1CD9E86a4561eC5a8c90BDA',
};

export const AWINO_MASTER_CHEF_ADDRESS_MAP = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: '0xC96A629fC6b9924DfA74d48Ba5FDDf39364ad9f2',
};

export const AWINO_BAR_ADDRESS_MAP = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: '0x661fB1B0774Ae54B2f4460C71b66052bC6C05eB2',
};

export const AWINO_MAKER_ADDRESS_MAP = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: '0x377eBC8b468b3cb18207522d43f413641dda4d65',
};

export interface FarmPool {
  pid: number;
  tokens: string[];
  lpTokenAddress: string;
}

export const farms: Map<ChainId, FarmPool[]> = new Map([
  [
    ChainId.TESTNET,
    [
      {
        pid: 0,
        tokens: ['AWI', 'USDT'],
        lpTokenAddress: '',
      },
      {
        pid: 1,
        tokens: ['AWI', 'DAI'],
        lpTokenAddress: '0x458a4bEb8C8020131591549440eDdE6d2d1c8212',
      },
      {
        pid: 2,
        tokens: ['AWI', 'WETH'],

        lpTokenAddress: '0x05Ec7ac6c5E47b23D1CD9E86a4561eC5a8c90BDA',
      },
    ],
  ],
]);
