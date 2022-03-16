import type React from 'react';

import { NextConfig } from 'next';

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
  | 'earn-deposit'
  | 'earn-deposit-details'
  | 'earn-liquidity-staking'
  | 'borrow'
  | 'borrow-details'
  | 'swap'
  | 'podl'
  | 'analytics'
  | 'contracts'
  | 'dashboard';

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
