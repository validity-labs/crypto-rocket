import type React from 'react';

import { NextConfig } from 'next';

import BigNumber from 'bignumber.js';

import { PaletteMode, SvgIconProps } from '@mui/material';

export interface NextAppConfig extends NextConfig {
  serverRuntimeConfig?: {};
  publicRuntimeConfig: {
    baseDomain: string;
  };
}

export type Language = 'en' | 'de';
export type I18nPageNamespace =
  | 'error'
  | 'landing'
  | 'market'
  | 'market-details'
  | 'earn-deposit'
  | 'earn-deposit-details'
  | 'earn-liquidity-staking'
  | 'borrow'
  | 'borrow-details'
  | 'swap'
  | 'podl'
  | 'analytics'
  | 'contracts'
  | 'dashboard'
  | 'portfolio';

export interface Breadcrumb {
  key: string;
  url: string;
}
export type Breadcrumbs = Breadcrumb[];

export type SetState<A> = React.Dispatch<React.SetStateAction<A>>;

export type ThemeMode = PaletteMode;
export interface MenuItemLink {
  type: 'internal' | 'external';
  key: string;
  url: string;
  icon?: React.FC<SvgIconProps>;
}

export interface MenuItemGroup {
  type: 'group';
  key: string;
  items: MenuItemLink[];
}

export type MenuItemType = MenuItemLink | MenuItemGroup;

export interface RowsState {
  page: number;
  pageSize: number;
}

export type ID = string;

export type Address = string;
export type TokenAsset = 'awi' | 'infinity' | 'wealth';
export type StableCoinAsset = 'dai' | 'usdc' | 'usdt';
export type AssetKey = TokenAsset | StableCoinAsset | 'ftm' | 'geistftm' | 'usd';

export interface ContractInfo {
  key: AssetKey;
  address: string;
}
export interface ContractsGrouped {
  tokens: {
    key: TokenAsset;
    address: Address;
  }[];
  stableCoins: {
    key: StableCoinAsset;
    address: Address;
  }[];
}

export interface BalanceInfo {
  key: AssetKey;
  value: number;
}
export interface BalanceGrouped {
  tokens: {
    key: TokenAsset;
    value: number;
  }[];
  stableCoins: {
    key: StableCoinAsset;
    value: number;
  }[];
}

export type MarketType = 'supply' | 'borrow';

export interface MarketInfo {
  price: BigNumber;
  marketLiquidity: BigNumber;
  nOfSuppliers: BigNumber;
  nOfBorrowers: BigNumber;
  borrowCap: BigNumber;
  interestPaidDay: BigNumber;
  reserves: BigNumber;
  reserveFactor: BigNumber;
  collateralFactor: BigNumber;
  cMinted: BigNumber;
  exchangeRate: BigNumber;
  utilization: BigNumber;
}

export type MarketTypeInfo = Record<
  MarketType,
  {
    netRate: number;
    apy: number;
    distributionApy: number;
    total: number;
  }
>;

interface StatsDataItem {
  value: number;
  subvalue?: number;
}
export type StatsData = StatsDataItem[];
