import JSBI from 'jsbi';

import { ChainId } from '../common/constants';

// exports for external consumption
export type BigintIsh = JSBI | number | string;

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export const FACTORY_ADDRESS = ''; // @TODO set mainnet address

export const FACTORY_ADDRESS_MAP = {
  [ChainId.MAINNET]: FACTORY_ADDRESS,
  [ChainId.TESTNET]: '0xCf1d959a77c1708fAF33a1a9eD0bb265d2b24447',
};

export const INIT_CODE_HASH = ''; // @TODO set mainnet hash

export const INIT_CODE_HASH_MAP = {
  [ChainId.MAINNET]: INIT_CODE_HASH,
  [ChainId.TESTNET]: '0x9af6258bb1e0cff7f6ca3dbf0eeb03c31700df22c3a84c072472030e9260dbee',
};

export const AWINO_ROUTER_MAP = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: '0x05289Bcf85770df7c7D9B280f869BadCE9D5ECCa',
};

export const AWINO_TOKEN_MAP = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: '0x02D1a756733F2C63DF89bCcB780C0C7A22D4E8a2',
};

export const AWINO_ZAP_MAP = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: '0x2d059a8aFC6Ea61824A7B06CDf33ec7fd6e35354',
};

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000);

export const LIQUIDITY_PROVIDER_FEE = 2.5;

// exports for internal consumption
export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);
export const TWO = JSBI.BigInt(2);
export const THREE = JSBI.BigInt(3);
export const FIVE = JSBI.BigInt(5);
export const TEN = JSBI.BigInt(10);
export const _100 = JSBI.BigInt(100);
export const FEES_NUMERATOR = JSBI.BigInt(9975);
export const FEES_DENOMINATOR = JSBI.BigInt(10000);

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256',
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
};
